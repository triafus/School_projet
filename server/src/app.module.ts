import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { User } from "./users/user.entity";
import { Image } from "./images/image.entity";
import { Collection } from "./collections/collection.entity";
import { ImagesModule } from "./images/images.module";
import { CollectionsModule } from "./collections/collections.module";
import { HealthController } from "./health/health.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(
      process.env.NODE_ENV === "test" && process.env.USE_SQLITE !== "false"
        ? {
            type: "sqlite",
            database: ":memory:",
            entities: [User, Image, Collection],
            synchronize: true,
            logging: false,
          }
        : {
            type: "postgres",
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE || process.env.DB_NAME,
            ssl:
              process.env.DB_SSL === "true"
                ? { rejectUnauthorized: false }
                : false,
            entities: [User, Image, Collection],
            synchronize: true,
            logging: process.env.NODE_ENV !== "test",
            logger: "advanced-console",
          }
    ),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        "SSILXFBvfr26VgVNcNOpYyyoKWtOACp9sAPG3k3xEBB+Pvn9qyO3GBdHXRUZNah+WjMeepI7B1DX8lKUU7AqvA==",
      signOptions: { expiresIn: "24h" },
    }),
    AuthModule,
    UsersModule,
    ImagesModule,
    // Register Collections module
    CollectionsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
