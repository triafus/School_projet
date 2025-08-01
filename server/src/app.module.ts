import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { User } from "./users/user.entity";
import { Image } from "./images/image.entity";
import { ImagesModule } from "./images/images.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
      entities: [User, Image],
      synchronize: true,
      logging: true,
      logger: "advanced-console",
    }),
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
  ],
})
export class AppModule {}
