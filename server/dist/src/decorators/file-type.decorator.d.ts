import { FileValidator } from "@nestjs/common";
export declare class FileTypeValidator extends FileValidator<Record<string, any>, Express.Multer.File> {
    private readonly allowedTypes;
    validationOptions: Record<string, any>;
    constructor(allowedTypes: string[]);
    isValid(file: Express.Multer.File): boolean;
    buildErrorMessage(file: Express.Multer.File): string;
}
