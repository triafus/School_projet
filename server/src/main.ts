import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

let cachedApp: any;

async function createApp() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      // Tolérant : autorise requêtes sans origine (Postman, curl), domaines *.vercel.app, localhost, ou VITE_FRONT_URL
      if (
        !origin ||
        origin.includes('vercel.app') ||
        origin.includes('localhost') ||
        (process.env.VITE_FRONT_URL &&
          origin.startsWith(process.env.VITE_FRONT_URL.replace(/\/$/, '')))
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api');

  return app;
}

// 1. Export du handler pour Vercel Serverless
export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    const app = await createApp();
    await app.init();
    cachedApp = app.getHttpAdapter().getInstance();
  }
  return cachedApp(req, res);
}

// 2. Démarrage standalone classique (en local / hors Vercel)
if (!process.env.VERCEL) {
  createApp().then(async (app) => {
    const port = process.env.PORT || 3001;
    await app.listen(port, '0.0.0.0');
  });
}
