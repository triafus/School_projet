import { Injectable, NestMiddleware, ForbiddenException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { ImagesService } from "../images.service";
import { User } from "src/users/user.entity";

@Injectable()
export class UploadLimitMiddleware implements NestMiddleware {
  constructor(private readonly imagesService: ImagesService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    
    // Si l'utilisateur n'est pas authentifié, laisser passer (le guard JWT s'en occupera)
    if (!user || !user.id) {
      return next();
    }
    
    const userId = user.id;
    const count = await this.imagesService.getUserImageCount(userId);

    if (count >= 50) {
      throw new ForbiddenException("Image upload limit reached");
    }

    next();
  }
}
