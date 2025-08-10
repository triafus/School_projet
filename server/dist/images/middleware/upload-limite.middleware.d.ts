import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { ImagesService } from "../images.service";
export declare class UploadLimitMiddleware implements NestMiddleware {
    private readonly imagesService;
    constructor(imagesService: ImagesService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
