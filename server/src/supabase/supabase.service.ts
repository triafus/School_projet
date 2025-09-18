import { Injectable } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Multer } from "multer";

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
        },
      }
    );
  }

  getClient() {
    return this.supabase;
  }

  async uploadFile(bucket: string, file: Express.Multer.File) {
    const fileName = `${Date.now()}-${file.originalname}`;

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error("Supabase upload error details:", error);
      console.log("Uploading file:", fileName, file.size, file.mimetype);
      console.log("Is buffer?", Buffer.isBuffer(file.buffer));

      throw new Error(
        "Upload failed: " + (error.message || JSON.stringify(error))
      );
    }

    return {
      url: this.supabase.storage.from(bucket).getPublicUrl(data.path).data
        .publicUrl,
      key: data.path,
    };
  }

  async deleteFile(bucket: string, key: string) {
    const { error } = await this.supabase.storage.from(bucket).remove([key]);

    if (error) throw new Error("Delete failed: " + error.message);
  }

  async getSignedUrl(bucket: string, key: string) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(key, 180);

    if (error) throw new Error("Signed URL failed: " + error.message);
    return data.signedUrl;
  }

  async transferFile(
    sourceBucket: string,
    destinationBucket: string,
    key: string
  ) {
    const { data: fileData, error: downloadError } = await this.supabase.storage
      .from(sourceBucket)
      .download(key);

    if (downloadError)
      throw new Error("Download failed: " + downloadError.message);

    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from(destinationBucket)
      .upload(key, fileData, {
        upsert: true,
      });

    if (uploadError) throw new Error("Upload failed: " + uploadError.message);

    const { error: deleteError } = await this.supabase.storage
      .from(sourceBucket)
      .remove([key]);

    if (deleteError) throw new Error("Delete failed: " + deleteError.message);

    return {
      url: this.supabase.storage.from(destinationBucket).getPublicUrl(key).data
        .publicUrl,
      key: key,
    };
  }
}
