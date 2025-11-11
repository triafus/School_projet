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
      query.where(
        "collection.is_private = false OR collection.userId = :userId",
        { userId }
      );
    } else {
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
    if (typeof (dto as any).is_private === "string") {
      (dto as any).is_private = (dto as any).is_private === "true";
    }

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

    if (dto.imageIds && dto.imageIds.length) {
      const images = await this.imagesRepository.find({
        where: { id: In(dto.imageIds) },
      });

      const foundIds = new Set(images.map((i) => i.id));
      const missing = dto.imageIds.filter((id) => !foundIds.has(id));
      if (missing.length) {
        throw new NotFoundException(
          `Images non trouvées: ${missing.join(", ")}`
        );
      }

      // Vérifier que l'utilisateur peut accéder à toutes les images
      const inaccessible = images.filter(
        (img) => !this.canAccessImage(img, user)
      );
      if (inaccessible.length) {
        throw new ForbiddenException(
          `Vous ne pouvez pas ajouter ces images à votre collection: ${inaccessible.map((i) => i.id).join(", ")}`
        );
      }

      // Pour les collections publiques, vérifier que toutes les images sont approuvées
      if (dto.is_private === false) {
        const unapproved = images.filter((img) => !img.is_approved);
        if (unapproved.length) {
          throw new BadRequestException(
            "Impossible de créer une collection publique avec des images non approuvées."
          );
        }
      }

      collection.images = images;
    }

    return this.collectionsRepository.save(collection);
  }

  async update(id: number, dto: UpdateCollectionDto, user: User) {
    const collection = await this.verifyOwnership(id, user);

    if (dto.title !== undefined) collection.title = dto.title;
    if (dto.description !== undefined) collection.description = dto.description;
    if (dto.is_private !== undefined) collection.is_private = dto.is_private;

    if (dto.imageIds !== undefined) {
      const images = dto.imageIds.length
        ? await this.imagesRepository.find({ where: { id: In(dto.imageIds) } })
        : [];

      // Vérifier que l'utilisateur peut accéder à toutes les images
      if (images.length > 0) {
        const inaccessible = images.filter(
          (img) => !this.canAccessImage(img, user)
        );
        if (inaccessible.length) {
          throw new ForbiddenException(
            `Vous ne pouvez pas ajouter ces images à votre collection: ${inaccessible.map((i) => i.id).join(", ")}`
          );
        }
      }

      collection.images = images;
    }

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

    const current = await this.collectionsRepository.findOne({
      where: { id: collection.id },
      relations: ["images"],
    });
    if (!current) throw new NotFoundException("Collection non trouvée");

    const addIds = dto.addImageIds ?? [];
    const removeIds = new Set(dto.removeImageIds ?? []);

    let imagesToAdd: Image[] = [];
    if (addIds.length) {
      imagesToAdd = await this.imagesRepository.find({
        where: { id: In(addIds) },
      });

      const foundIds = new Set(imagesToAdd.map((i) => i.id));
      const missing = addIds.filter((id) => !foundIds.has(id));
      if (missing.length) {
        throw new NotFoundException(
          `Images non trouvées: ${missing.join(", ")}`
        );
      }

      // Vérifier que l'utilisateur peut accéder à toutes les images
      const inaccessible = imagesToAdd.filter(
        (img) => !this.canAccessImage(img, user)
      );
      if (inaccessible.length) {
        throw new ForbiddenException(
          `Vous ne pouvez pas ajouter ces images à votre collection: ${inaccessible.map((i) => i.id).join(", ")}`
        );
      }
    }

    const kept = (current.images || []).filter((img) => !removeIds.has(img.id));

    const mergedById = new Map<number, Image>();
    for (const img of kept) mergedById.set(img.id, img);
    for (const img of imagesToAdd) mergedById.set(img.id, img);

    current.images = Array.from(mergedById.values());

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

  /**
   * Vérifie si un utilisateur peut accéder à une image.
   * Un utilisateur peut accéder à une image si :
   * - Il est admin
   * - Il est le propriétaire de l'image
   * - L'image est publique (is_private = false) ET approuvée (is_approved = true)
   */
  private canAccessImage(image: Image, user: User): boolean {
    // Les admins peuvent accéder à toutes les images
    if (user.role === "admin") {
      return true;
    }

    // Le propriétaire peut accéder à ses propres images
    if (image.userId === user.id) {
      return true;
    }

    // Les autres utilisateurs peuvent accéder aux images publiques et approuvées
    return !image.is_private && image.is_approved;
  }
}
