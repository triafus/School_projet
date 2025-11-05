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
exports.UploadLimitMiddleware = void 0;
const common_1 = require("@nestjs/common");
const images_service_1 = require("../images.service");
let UploadLimitMiddleware = class UploadLimitMiddleware {
    constructor(imagesService) {
        this.imagesService = imagesService;
    }
    async use(req, res, next) {
        const user = req.user;
        if (!user || !user.id) {
            return next();
        }
        const userId = user.id;
        const count = await this.imagesService.getUserImageCount(userId);
        if (count >= 50) {
            throw new common_1.ForbiddenException("Image upload limit reached");
        }
        next();
    }
};
exports.UploadLimitMiddleware = UploadLimitMiddleware;
exports.UploadLimitMiddleware = UploadLimitMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [images_service_1.ImagesService])
], UploadLimitMiddleware);
//# sourceMappingURL=upload-limite.middleware.js.map