"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
let SupabaseService = class SupabaseService {
    constructor() {
        this.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
            auth: {
                persistSession: false,
            },
        });
    }
    getClient() {
        return this.supabase;
    }
    async uploadFile(bucket, file) {
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
            throw new Error("Upload failed: " + (error.message || JSON.stringify(error)));
        }
        return {
            url: this.supabase.storage.from(bucket).getPublicUrl(data.path).data
                .publicUrl,
            key: data.path,
        };
    }
    async deleteFile(bucket, key) {
        const { error } = await this.supabase.storage.from(bucket).remove([key]);
        if (error)
            throw new Error("Delete failed: " + error.message);
    }
    async getSignedUrl(bucket, key) {
        const { data, error } = await this.supabase.storage
            .from(bucket)
            .createSignedUrl(key, 180);
        if (error)
            throw new Error("Signed URL failed: " + error.message);
        return data.signedUrl;
    }
    async transferFile(sourceBucket, destinationBucket, key) {
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
        if (uploadError)
            throw new Error("Upload failed: " + uploadError.message);
        const { error: deleteError } = await this.supabase.storage
            .from(sourceBucket)
            .remove([key]);
        if (deleteError)
            throw new Error("Delete failed: " + deleteError.message);
        return {
            url: this.supabase.storage.from(destinationBucket).getPublicUrl(key).data
                .publicUrl,
            key: key,
        };
    }
};
exports.SupabaseService = SupabaseService;
exports.SupabaseService = SupabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SupabaseService);
//# sourceMappingURL=supabase.service.js.map