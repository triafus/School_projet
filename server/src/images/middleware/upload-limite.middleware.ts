import { Injectable, NestMiddleware, ForbiddenException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { ImagesService } from "../images.service";

@Injectable()
export class UploadLimitMiddleware implements NestMiddleware {
  constructor(private readonly imagesService: ImagesService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.id;
    const count = await this.imagesService.getUserImageCount(userId);

    if (count >= 50) {
      throw new ForbiddenException("Image upload limit reached");
    }

    next();
  }
}
