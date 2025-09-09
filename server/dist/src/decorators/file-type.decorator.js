"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTypeValidator = void 0;
const common_1 = require("@nestjs/common");
class FileTypeValidator extends common_1.FileValidator {
    constructor(allowedTypes) {
        super({
            message: `File type must be one of the following: ${allowedTypes.join(", ")}`,
        });
        this.allowedTypes = allowedTypes;
        this.validationOptions = {};
    }
    isValid(file) {
        return this.allowedTypes.includes(file.mimetype);
    }
    buildErrorMessage(file) {
        return `Invalid file type. Allowed types: ${this.allowedTypes.join(", ")}`;
    }
}
exports.FileTypeValidator = FileTypeValidator;
//# sourceMappingURL=file-type.decorator.js.map