import { FileValidator } from "@nestjs/common";

export class FileTypeValidator extends FileValidator<
  Record<string, any>,
  Express.Multer.File
> {
  validationOptions: Record<string, any>;

  constructor(private readonly allowedTypes: string[]) {
    super({
      message: `File type must be one of the following: ${allowedTypes.join(", ")}`,
    });
    this.validationOptions = {};
  }

  isValid(file: Express.Multer.File) {
    return this.allowedTypes.includes(file.mimetype);
  }

  buildErrorMessage(file: Express.Multer.File) {
    return `Invalid file type. Allowed types: ${this.allowedTypes.join(", ")}`;
  }
}
