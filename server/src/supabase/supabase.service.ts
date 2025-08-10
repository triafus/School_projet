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
      .createSignedUrl(key, 60); // 60 secondes

    if (error) throw new Error("Signed URL failed: " + error.message);
    return data.signedUrl;
  }
}
