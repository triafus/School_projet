import { Image } from "../images/image.entity";
export declare class User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: string;
    images: Image[];
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<User>);
}
