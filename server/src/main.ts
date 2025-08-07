import { NestFactory, Reflector } from "@nestjs/core";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { RemoveSensitiveFieldsInterceptor } from "./interceptors/remove-sensitive-fields.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log("App démarrée");

  // Enable CORS pour le frontend React
  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
  });

  // Intercepteur pour supprimer les champs sensibles
  /*   app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); */

  // Validation globale
  app.useGlobalPipes(new ValidationPipe());

  // Préfixe API
  app.setGlobalPrefix("api");

  /*  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      enableCircularCheck: true,
      excludeExtraneousValues: true,
    })
  ); */

  await app.listen(process.env.PORT);
  console.log("🚀 Server running on http://localhost:3001");
}

bootstrap();
