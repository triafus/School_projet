import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
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
  private readonly PRIV_BUCKET_NAME = "private_images";
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
  ];

  constructor(
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
    private supabaseService: SupabaseService
  ) {}

  async findAll(includePrivate = false) {
    const query = this.imagesRepository
      .createQueryBuilder("image")
      .leftJoinAndSelect("image.user", "user");
    /* .where("image.is_approved = :approved", { approved: true }); */

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

  /* async update(id: number, updateImageDto: UpdateImageDto, user: User) {
    const image = await this.verifyOwnership(id, user);

    Object.assign(image, updateImageDto);
    return this.imagesRepository.save(image);
  } */

  async update(id: number, updateImageDto: UpdateImageDto, user: User) {
    const image = await this.verifyOwnership(id, user);
    const oldIsPrivate = image.is_private;

    // Si le statut de confidentialité a changé
    if (
      updateImageDto.is_private !== undefined &&
      updateImageDto.is_private !== oldIsPrivate
    ) {
      const sourceBucket = oldIsPrivate
        ? this.PRIV_BUCKET_NAME
        : this.BUCKET_NAME;
      const destBucket = oldIsPrivate
        ? this.BUCKET_NAME
        : this.PRIV_BUCKET_NAME;

      // Transférer le fichier entre les buckets
      const { url, key } = await this.supabaseService.transferFile(
        sourceBucket,
        destBucket,
        image.key
      );

      // Mettre à jour l'URL et la clé
      image.url = url;
      image.key = key;
    }

    // Mettre à jour les autres propriétés
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
      url: await this.supabaseService.getSignedUrl(
        this.PRIV_BUCKET_NAME,
        image.key
      ),
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
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.ALLOWED_MIME_TYPES.join(", ")}`
      );
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File too large. Max size: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`
      );
    }
  }
}
