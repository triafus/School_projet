import { SupabaseClient } from "@supabase/supabase-js";
export declare class SupabaseService {
    private supabase;
    constructor();
    getClient(): SupabaseClient<any, "public", "public", any, any>;
    uploadFile(bucket: string, file: Express.Multer.File): Promise<{
        url: string;
        key: string;
    }>;
    deleteFile(bucket: string, key: string): Promise<void>;
    getSignedUrl(bucket: string, key: string): Promise<string>;
    transferFile(sourceBucket: string, destinationBucket: string, key: string): Promise<{
        url: string;
        key: string;
    }>;
}
