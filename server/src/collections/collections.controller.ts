import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "../auth/optional-jwt-auth.guard";
import { CollectionsService } from "./collections.service";
import { CreateCollectionDto } from "./dto/create-collection.dto";
import { UpdateCollectionDto } from "./dto/update-collection.dto";
import { UpdateCollectionImagesDto } from "./dto/update-collection-images.dto";
import { Request } from "express";
import { User } from "../users/user.entity";

@Controller("collections")
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(@Req() req: Request) {
    const userId = req.user ? (req.user as User).id : undefined;
    return this.collectionsService.findAll(userId);
  }

  @Get(":id")
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(@Param("id") id: string, @Req() req: Request) {
    return this.collectionsService.findOne(
      parseInt(id),
      req.user ? (req.user as User).id : undefined
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateCollectionDto, @Req() req: Request) {
    return this.collectionsService.create(dto, req.user as User);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateCollectionDto,
    @Req() req: Request
  ) {
    return this.collectionsService.update(parseInt(id), dto, req.user as User);
  }

  @Patch(":id/images")
  @UseGuards(JwtAuthGuard)
  async updateImages(
    @Param("id") id: string,
    @Body() dto: UpdateCollectionImagesDto,
    @Req() req: Request
  ) {
    return this.collectionsService.updateImages(
      parseInt(id),
      dto,
      req.user as User
    );
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async remove(@Param("id") id: string, @Req() req: Request) {
    return this.collectionsService.remove(parseInt(id), req.user as User);
  }
}
