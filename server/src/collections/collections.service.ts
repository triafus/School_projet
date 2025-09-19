import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Collection } from "./collection.entity";
import { CreateCollectionDto } from "./dto/create-collection.dto";
import { UpdateCollectionDto } from "./dto/update-collection.dto";
import { User } from "../users/user.entity";

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private collectionsRepository: Repository<Collection>
  ) {}

  async findAll(userId?: number) {
    const query = this.collectionsRepository
      .createQueryBuilder("collection")
      .leftJoinAndSelect("collection.user", "user");

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
      relations: ["user"],
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
      ...dto,
      user,
      userId: user.id,
    });

    return this.collectionsRepository.save(collection);
  }

  async update(id: number, dto: UpdateCollectionDto, user: User) {
    const collection = await this.verifyOwnership(id, user);
    Object.assign(collection, dto);
    return this.collectionsRepository.save(collection);
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
