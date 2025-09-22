import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Collection } from "./collection.entity";
import { CollectionsController } from "./collections.controller";
import { CollectionsService } from "./collections.service";
import { Image } from "../images/image.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Collection, Image])],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [TypeOrmModule, CollectionsService],
})
export class CollectionsModule {}
