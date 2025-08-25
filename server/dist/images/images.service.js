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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const image_entity_1 = require("./image.entity");
const supabase_service_1 = require("../supabase/supabase.service");
let ImagesService = class ImagesService {
    constructor(imagesRepository, supabaseService) {
        this.imagesRepository = imagesRepository;
        this.supabaseService = supabaseService;
        this.BUCKET_NAME = "images";
        this.MAX_FILE_SIZE = 5 * 1024 * 1024;
        this.ALLOWED_MIME_TYPES = [
            "image/jpeg",
            "image/png",
            "image/gif",
        ];
    }
    async findAll(includePrivate = false) {
        const query = this.imagesRepository
            .createQueryBuilder("image")
            .leftJoinAndSelect("image.user", "user");
        if (!includePrivate) {
            query.andWhere("image.is_private = :private", { private: false });
        }
        return query.getMany();
    }
    async findOne(id, userId) {
        const image = await this.imagesRepository.findOne({
            where: { id },
            relations: ["user"],
        });
        if (!image)
            throw new common_1.NotFoundException("Image not found");
        if (image.is_private && image.user.id !== userId) {
            throw new common_1.ForbiddenException("Access to private image denied");
        }
        return image;
    }
    async create(file, createImageDto, user) {
        this.validateFile(file);
        const { url, key } = await this.supabaseService.uploadFile(this.BUCKET_NAME, file);
        const image = this.imagesRepository.create(Object.assign(Object.assign({}, createImageDto), { url,
            key,
            user, userId: user.id, is_approved: user.role === "admin" }));
        return this.imagesRepository.save(image);
    }
    async update(id, updateImageDto, user) {
        const image = await this.verifyOwnership(id, user);
        Object.assign(image, updateImageDto);
        return this.imagesRepository.save(image);
    }
    async remove(id, user) {
        const image = await this.verifyOwnership(id, user);
        await this.supabaseService.deleteFile(this.BUCKET_NAME, image.key);
        return this.imagesRepository.remove(image);
    }
    async approveImage(id, isApproved) {
        const image = await this.imagesRepository.findOneBy({ id });
        if (!image)
            throw new common_1.NotFoundException("Image not found");
        image.is_approved = isApproved;
        return this.imagesRepository.save(image);
    }
    async getUserImageCount(userId) {
        return this.imagesRepository.count({
            where: { user: { id: userId } },
        });
    }
    async getSignedUrl(image) {
        if (!image.is_private) {
            return { url: image.url };
        }
        return {
            url: await this.supabaseService.getSignedUrl(this.BUCKET_NAME, image.key),
        };
    }
    async verifyOwnership(id, user) {
        const image = await this.imagesRepository.findOne({
            where: { id },
            relations: ["user"],
        });
        if (!image)
            throw new common_1.NotFoundException("Image not found");
        if (user.role !== "admin" && image.user.id !== user.id) {
            throw new common_1.ForbiddenException("You do not own this image");
        }
        return image;
    }
    validateFile(file) {
        if (!file) {
            throw new common_1.BadRequestException("No file uploaded");
        }
        if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`Invalid file type. Allowed types: ${this.ALLOWED_MIME_TYPES.join(", ")}`);
        }
        if (file.size > this.MAX_FILE_SIZE) {
            throw new common_1.BadRequestException(`File too large. Max size: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`);
        }
    }
};
exports.ImagesService = ImagesService;
exports.ImagesService = ImagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(image_entity_1.Image)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        supabase_service_1.SupabaseService])
], ImagesService);
//# sourceMappingURL=images.service.js.map