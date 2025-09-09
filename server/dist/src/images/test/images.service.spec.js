"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const images_service_1 = require("../images.service");
const image_entity_1 = require("../image.entity");
const supabase_service_1 = require("../../supabase/supabase.service");
describe("ImagesService", () => {
    let service;
    let repository;
    let supabaseService;
    const mockUser = {
        id: 1,
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        password: "hashedPassword",
        role: "user",
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const mockAdminUser = Object.assign(Object.assign({}, mockUser), { id: 2, email: "admin@example.com", role: "admin" });
    const mockImage = {
        id: 1,
        title: "Test Image",
        description: "Test Description",
        url: "https://example.com/image.jpg",
        key: "images/test-key",
        is_approved: true,
        is_private: false,
        user: mockUser,
        userId: mockUser.id,
        created_at: new Date(),
        updated_at: new Date(),
    };
    const mockRepository = {
        createQueryBuilder: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
        findOne: jest.fn(),
        findOneBy: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
        count: jest.fn(),
    };
    const mockSupabaseService = {
        uploadFile: jest.fn(),
        deleteFile: jest.fn(),
        getSignedUrl: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                images_service_1.ImagesService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(image_entity_1.Image),
                    useValue: mockRepository,
                },
                {
                    provide: supabase_service_1.SupabaseService,
                    useValue: mockSupabaseService,
                },
            ],
        }).compile();
        service = module.get(images_service_1.ImagesService);
        repository = module.get((0, typeorm_1.getRepositoryToken)(image_entity_1.Image));
        supabaseService = module.get(supabase_service_1.SupabaseService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("findAll", () => {
        it("✔️ should return empty array when no images exist", async () => {
            mockRepository.getMany.mockResolvedValue([]);
            const result = await service.findAll();
            expect(result).toEqual([]);
            expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith("image");
        });
        it("✔️ should return list of approved public images", async () => {
            const images = [mockImage];
            mockRepository.getMany.mockResolvedValue(images);
            const result = await service.findAll();
            expect(result).toEqual(images);
            expect(mockRepository.where).toHaveBeenCalledWith("image.is_approved = :approved", { approved: true });
            expect(mockRepository.andWhere).toHaveBeenCalledWith("image.is_private = :private", { private: false });
        });
        it("should include private images when includePrivate is true", async () => {
            const images = [mockImage];
            mockRepository.getMany.mockResolvedValue(images);
            const result = await service.findAll(true);
            expect(result).toEqual(images);
            expect(mockRepository.andWhere).not.toHaveBeenCalledWith("image.is_private = :private", { private: false });
        });
    });
    describe("findOne", () => {
        it("✔️ should return image when found and accessible", async () => {
            mockRepository.findOne.mockResolvedValue(mockImage);
            const result = await service.findOne(1, mockUser.id);
            expect(result).toEqual(mockImage);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                relations: ["user"],
            });
        });
        it("✔️ should throw NotFoundException when image does not exist", async () => {
            mockRepository.findOne.mockResolvedValue(null);
            await expect(service.findOne(999)).rejects.toThrow(common_1.NotFoundException);
            await expect(service.findOne(999)).rejects.toThrow("Image not found");
        });
        it("should throw ForbiddenException when accessing private image without ownership", async () => {
            const privateImage = Object.assign(Object.assign({}, mockImage), { is_private: true });
            mockRepository.findOne.mockResolvedValue(privateImage);
            await expect(service.findOne(1, 999)).rejects.toThrow(common_1.ForbiddenException);
            await expect(service.findOne(1, 999)).rejects.toThrow("Access to private image denied");
        });
    });
    describe("create", () => {
        const mockFile = {
            fieldname: "file",
            originalname: "test.jpg",
            encoding: "7bit",
            mimetype: "image/jpeg",
            size: 1024 * 1024,
            buffer: Buffer.from("fake-image-data"),
        };
        const createImageDto = {
            title: "New Image",
            description: "New Description",
            is_private: false,
        };
        it("✔️ should create image successfully with valid data", async () => {
            const uploadResult = {
                url: "https://example.com/uploaded.jpg",
                key: "images/new-key",
            };
            mockSupabaseService.uploadFile.mockResolvedValue(uploadResult);
            mockRepository.create.mockReturnValue(mockImage);
            mockRepository.save.mockResolvedValue(mockImage);
            const result = await service.create(mockFile, createImageDto, mockUser);
            expect(result).toEqual(mockImage);
            expect(mockSupabaseService.uploadFile).toHaveBeenCalledWith("images", mockFile);
            expect(mockRepository.create).toHaveBeenCalledWith(Object.assign(Object.assign({}, createImageDto), { url: uploadResult.url, key: uploadResult.key, user: mockUser, userId: mockUser.id, is_approved: false }));
            expect(mockRepository.save).toHaveBeenCalledWith(mockImage);
        });
        it("✔️ should auto-approve image for admin users", async () => {
            const uploadResult = {
                url: "https://example.com/uploaded.jpg",
                key: "images/new-key",
            };
            mockSupabaseService.uploadFile.mockResolvedValue(uploadResult);
            mockRepository.create.mockReturnValue(mockImage);
            mockRepository.save.mockResolvedValue(mockImage);
            await service.create(mockFile, createImageDto, mockAdminUser);
            expect(mockRepository.create).toHaveBeenCalledWith(Object.assign(Object.assign({}, createImageDto), { url: uploadResult.url, key: uploadResult.key, user: mockAdminUser, userId: mockAdminUser.id, is_approved: true }));
        });
        it("should throw BadRequestException when no file is provided", async () => {
            await expect(service.create(null, createImageDto, mockUser)).rejects.toThrow(common_1.BadRequestException);
            await expect(service.create(null, createImageDto, mockUser)).rejects.toThrow("No file uploaded");
        });
        it("should throw BadRequestException for invalid file type", async () => {
            const invalidFile = Object.assign(Object.assign({}, mockFile), { mimetype: "text/plain" });
            await expect(service.create(invalidFile, createImageDto, mockUser)).rejects.toThrow(common_1.BadRequestException);
        });
        it("should throw BadRequestException for oversized file", async () => {
            const largeFile = Object.assign(Object.assign({}, mockFile), { size: 10 * 1024 * 1024 });
            await expect(service.create(largeFile, createImageDto, mockUser)).rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe("update", () => {
        const updateImageDto = { title: "Updated Title" };
        it("should update image when user owns it", async () => {
            mockRepository.findOne.mockResolvedValue(mockImage);
            const updatedImage = Object.assign(Object.assign({}, mockImage), updateImageDto);
            mockRepository.save.mockResolvedValue(updatedImage);
            const result = await service.update(1, updateImageDto, mockUser);
            expect(result).toEqual(updatedImage);
            expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining(updateImageDto));
        });
        it("should throw NotFoundException when image does not exist", async () => {
            mockRepository.findOne.mockResolvedValue(null);
            await expect(service.update(999, updateImageDto, mockUser)).rejects.toThrow(common_1.NotFoundException);
        });
        it("should throw ForbiddenException when user does not own the image", async () => {
            const otherUserImage = Object.assign(Object.assign({}, mockImage), { user: Object.assign(Object.assign({}, mockUser), { id: 999 }), userId: 999 });
            mockRepository.findOne.mockResolvedValue(otherUserImage);
            await expect(service.update(1, updateImageDto, mockUser)).rejects.toThrow(common_1.ForbiddenException);
        });
    });
    describe("remove", () => {
        it("should delete image and file when user owns it", async () => {
            mockRepository.findOne.mockResolvedValue(mockImage);
            mockRepository.remove.mockResolvedValue(mockImage);
            mockSupabaseService.deleteFile.mockResolvedValue(undefined);
            const result = await service.remove(1, mockUser);
            expect(result).toEqual(mockImage);
            expect(mockSupabaseService.deleteFile).toHaveBeenCalledWith("images", mockImage.key);
            expect(mockRepository.remove).toHaveBeenCalledWith(mockImage);
        });
        it("should throw NotFoundException when image does not exist", async () => {
            mockRepository.findOne.mockResolvedValue(null);
            await expect(service.remove(999, mockUser)).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe("approveImage", () => {
        it("should approve image successfully", async () => {
            mockRepository.findOneBy.mockResolvedValue(mockImage);
            const approvedImage = Object.assign(Object.assign({}, mockImage), { is_approved: true });
            mockRepository.save.mockResolvedValue(approvedImage);
            const result = await service.approveImage(1, true);
            expect(result.is_approved).toBe(true);
            expect(mockRepository.save).toHaveBeenCalled();
        });
        it("should throw NotFoundException when image does not exist", async () => {
            mockRepository.findOneBy.mockResolvedValue(null);
            await expect(service.approveImage(999, true)).rejects.toThrow(common_1.NotFoundException);
        });
    });
});
//# sourceMappingURL=images.service.spec.js.map