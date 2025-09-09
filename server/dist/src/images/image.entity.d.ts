import { User } from "../users/user.entity";
export declare class Image {
    id: number;
    title: string;
    description: string;
    url: string;
    key: string;
    is_approved: boolean;
    is_private: boolean;
    user: User;
    userId: number;
    created_at: Date;
    updated_at: Date;
}
