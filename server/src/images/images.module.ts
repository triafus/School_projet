import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Image } from "./image.entity";
import { UsersModule } from "../users/users.module";
import { ImagesController } from "./images.controller";
import { ImagesService } from "./images.service";
import { SupabaseService } from "../supabase/supabase.service";
import { UploadLimitMiddleware } from "./middleware/upload-limite.middleware";

@Module({
  imports: [TypeOrmModule.forFeature([Image]), UsersModule],
  controllers: [ImagesController],
  providers: [ImagesService, SupabaseService],
  exports: [ImagesService],
})
export class ImagesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UploadLimitMiddleware)
      .forRoutes({ path: "api/images", method: RequestMethod.POST });
  }
}
