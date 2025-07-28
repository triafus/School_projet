import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS pour le frontend React
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Validation globale
  app.useGlobalPipes(new ValidationPipe());

  // Préfixe API
  app.setGlobalPrefix('api');

  await app.listen(3001);
  console.log('🚀 Server running on http://localhost:3001');
}

bootstrap();