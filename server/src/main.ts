import { NestFactory, Reflector } from "@nestjs/core";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { RemoveSensitiveFieldsInterceptor } from "./interceptors/remove-sensitive-fields.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log("App démarrée");

  app.enableCors({
    origin: process.env.VITE_FRONT_URL || "http://localhost:3000",
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix("api");

  await app.listen(process.env.PORT || 3001, "0.0.0.0");
}

bootstrap();
