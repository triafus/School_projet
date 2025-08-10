import { ImagesService } from "./images.service";
import { CreateImageDto } from "./dto/create-image.dto";
import { UpdateImageDto } from "./dto/update-image.dto";
import { Request } from "express";
export declare class ImagesController {
    private readonly imagesService;
    constructor(imagesService: ImagesService);
    findAll(): Promise<import("./image.entity").Image[]>;
    findOne(id: string, req: Request): Promise<import("./image.entity").Image>;
    create(file: Express.Multer.File, createImageDto: CreateImageDto, req: Request): Promise<import("./image.entity").Image>;
    update(id: string, updateImageDto: UpdateImageDto, req: Request): Promise<import("./image.entity").Image>;
    remove(id: string, req: Request): Promise<import("./image.entity").Image>;
    approveImage(id: string, isApproved: boolean): Promise<import("./image.entity").Image>;
    getSignedUrl(id: string, req: Request): Promise<{
        url: string;
    }>;
}
