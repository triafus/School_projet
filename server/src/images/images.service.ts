import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Image } from "./image.entity";
import { CreateImageDto } from "./dto/create-image.dto";
import { UpdateImageDto } from "./dto/update-image.dto";
import { SupabaseService } from "../supabase/supabase.service";
import { User } from "../users/user.entity";

@Injectable()
export class ImagesService {
  private readonly BUCKET_NAME = "images";

  constructor(
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
    private supabaseService: SupabaseService
  ) {}

  async findAll(includePrivate = false) {
    const query = this.imagesRepository
      .createQueryBuilder("image")
      .leftJoinAndSelect("image.user", "user")
      .where("image.is_approved = :approved", { approved: true });

    if (!includePrivate) {
      query.andWhere("image.is_private = :private", { private: false });
    }

    return query.getMany();
  }

  async findOne(id: number, userId?: number) {
    const image = await this.imagesRepository.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!image) throw new NotFoundException("Image not found");

    if (image.is_private && image.user.id !== userId) {
      throw new ForbiddenException("Access to private image denied");
    }

    return image;
  }

  async create(
    file: Express.Multer.File,
    createImageDto: CreateImageDto,
    user: User
  ) {
    this.validateFile(file);

    const { url, key } = await this.supabaseService.uploadFile(
      this.BUCKET_NAME,
      file
    );

    const image = this.imagesRepository.create({
      ...createImageDto,
      url,
      key,
      user,
      userId: user.id,
      is_approved: user.role === "admin",
    });

    return this.imagesRepository.save(image);
  }

  async update(id: number, updateImageDto: UpdateImageDto, user: User) {
    const image = await this.verifyOwnership(id, user);

    Object.assign(image, updateImageDto);
    return this.imagesRepository.save(image);
  }

  async remove(id: number, user: User) {
    const image = await this.verifyOwnership(id, user);

    await this.supabaseService.deleteFile(this.BUCKET_NAME, image.key);

    return this.imagesRepository.remove(image);
  }

  async approveImage(id: number, isApproved: boolean) {
    const image = await this.imagesRepository.findOneBy({ id });
    if (!image) throw new NotFoundException("Image not found");

    image.is_approved = isApproved;
    return this.imagesRepository.save(image);
  }

  async getUserImageCount(userId: number): Promise<number> {
    return this.imagesRepository.count({
      where: { user: { id: userId } },
    });
  }

  async getSignedUrl(image: Image) {
    if (!image.is_private) {
      return { url: image.url };
    }

    return {
      url: await this.supabaseService.getSignedUrl(this.BUCKET_NAME, image.key),
    };
  }

  private async verifyOwnership(id: number, user: User) {
    const image = await this.imagesRepository.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!image) throw new NotFoundException("Image not found");

    if (user.role !== "admin" && image.user.id !== user.id) {
      throw new ForbiddenException("You do not own this image");
    }

    return image;
  }

  private validateFile(file: Express.Multer.File) {
    if (!file) throw new Error("No file uploaded");

    const allowedMimes = ["image/jpeg", "image/png"];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new Error("Invalid file type. Allowed: JPEG, PNG");
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("File too large. Max size: 2MB");
    }
  }
}
