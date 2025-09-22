import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Collection } from "./collection.entity";
import { CreateCollectionDto } from "./dto/create-collection.dto";
import { UpdateCollectionDto } from "./dto/update-collection.dto";
import { User } from "../users/user.entity";
import { Image } from "../images/image.entity";
import { UpdateCollectionImagesDto } from "./dto/update-collection-images.dto";

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private collectionsRepository: Repository<Collection>,
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>
  ) {}

  async findAll(userId?: number) {
    const query = this.collectionsRepository
      .createQueryBuilder("collection")
      .leftJoinAndSelect("collection.user", "user")
      .leftJoinAndSelect("collection.images", "images");

    if (userId) {
      // Public collections or private ones owned by the requester
      query.where(
        "collection.is_private = false OR collection.userId = :userId",
        { userId }
      );
    } else {
      // Only public collections for anonymous users
      query.where("collection.is_private = false");
    }

    return query.getMany();
  }

  async findOne(id: number, userId?: number) {
    const collection = await this.collectionsRepository.findOne({
      where: { id },
      relations: ["user", "images"],
    });

    if (!collection) throw new NotFoundException("Collection non trouvée");

    if (collection.is_private && collection.user.id !== userId) {
      throw new ForbiddenException("Accès refusé à cette collection privée");
    }

    return collection;
  }

  async create(dto: CreateCollectionDto, user: User) {
    // autoriser string "true"/"false" comme pour images
    if (typeof (dto as any).is_private === "string") {
      (dto as any).is_private = (dto as any).is_private === "true";
    }

    // privé par défaut si non fourni
    if (dto.is_private === undefined) {
      dto.is_private = true;
    }

    const collection = this.collectionsRepository.create({
      title: dto.title,
      description: dto.description,
      is_private: dto.is_private,
      user,
      userId: user.id,
    });

    // attach images if provided
    if (dto.imageIds && dto.imageIds.length) {
      const images = await this.imagesRepository.find({
        where: { id: In(dto.imageIds) },
      });

      // Validate ownership or admin rights
      if (user.role !== "admin") {
        const unauthorized = images.filter((img) => img.userId !== user.id);
        if (unauthorized.length) {
          throw new ForbiddenException(
            "Vous ne pouvez associer que vos propres images à la collection"
          );
        }
      }

      // Ensure all provided IDs exist
      const foundIds = new Set(images.map((i) => i.id));
      const missing = dto.imageIds.filter((id) => !foundIds.has(id));
      if (missing.length) {
        throw new NotFoundException(
          `Images non trouvées: ${missing.join(", ")}`
        );
      }

      collection.images = images;
    }

    return this.collectionsRepository.save(collection);
  }

  async update(id: number, dto: UpdateCollectionDto, user: User) {
    const collection = await this.verifyOwnership(id, user);

    // Basic fields
    if (dto.title !== undefined) collection.title = dto.title;
    if (dto.description !== undefined) collection.description = dto.description;
    if (dto.is_private !== undefined) collection.is_private = dto.is_private;

    // Replace associations when imageIds provided (allow empty array to clear)
    if (dto.imageIds !== undefined) {
      const images = dto.imageIds.length
        ? await this.imagesRepository.find({ where: { id: In(dto.imageIds) } })
        : [];
      collection.images = images;
    }

    // Business rule: cannot make public if contains unapproved images
    const nextIsPrivate = dto.is_private ?? collection.is_private;
    if (nextIsPrivate === false) {
      const hasUnapproved = (collection.images || []).some(
        (img) => !img.is_approved
      );
      if (hasUnapproved) {
        throw new BadRequestException(
          "Impossible de rendre la collection publique: elle contient des images non approuvées."
        );
      }
    }

    return this.collectionsRepository.save(collection);
  }

  async updateImages(id: number, dto: UpdateCollectionImagesDto, user: User) {
    const collection = await this.verifyOwnership(id, user);

    // Load current images set
    const current = await this.collectionsRepository.findOne({
      where: { id: collection.id },
      relations: ["images"],
    });
    if (!current) throw new NotFoundException("Collection non trouvée");

    const addIds = dto.addImageIds ?? [];
    const removeIds = new Set(dto.removeImageIds ?? []);

    // Fetch images to add
    let imagesToAdd: Image[] = [];
    if (addIds.length) {
      imagesToAdd = await this.imagesRepository.find({
        where: { id: In(addIds) },
      });

      // Ownership validation
      if (user.role !== "admin") {
        const unauthorized = imagesToAdd.filter(
          (img) => img.userId !== user.id
        );
        if (unauthorized.length) {
          throw new ForbiddenException(
            "Vous ne pouvez associer que vos propres images à la collection"
          );
        }
      }

      // Ensure all add IDs exist
      const foundIds = new Set(imagesToAdd.map((i) => i.id));
      const missing = addIds.filter((id) => !foundIds.has(id));
      if (missing.length) {
        throw new NotFoundException(
          `Images non trouvées: ${missing.join(", ")}`
        );
      }
    }

    // Build next set: (current - remove) + add
    const kept = (current.images || []).filter((img) => !removeIds.has(img.id));

    // Merge by id uniqueness
    const mergedById = new Map<number, Image>();
    for (const img of kept) mergedById.set(img.id, img);
    for (const img of imagesToAdd) mergedById.set(img.id, img);

    current.images = Array.from(mergedById.values());

    // Business rule: cannot make public if contains unapproved images
    if (current.is_private === false) {
      const hasUnapproved = (current.images || []).some(
        (img) => !img.is_approved
      );
      if (hasUnapproved) {
        throw new BadRequestException(
          "Impossible de rendre la collection publique: elle contient des images non approuvées."
        );
      }
    }

    return this.collectionsRepository.save(current);
  }

  async remove(id: number, user: User) {
    const collection = await this.verifyOwnership(id, user);
    return this.collectionsRepository.remove(collection);
  }

  private async verifyOwnership(id: number, user: User) {
    const collection = await this.collectionsRepository.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!collection) throw new NotFoundException("Collection non trouvée");

    if (user.role !== "admin" && collection.user.id !== user.id) {
      throw new ForbiddenException(
        "Vous n'êtes pas propriétaire de cette collection"
      );
    }

    return collection;
  }
}
