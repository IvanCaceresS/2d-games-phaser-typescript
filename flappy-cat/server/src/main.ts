import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Permitir CORS para todas las solicitudes entrantes
  app.useGlobalPipes(new ValidationPipe()); // Habilitar validación global
  await app.listen(3000);
}
bootstrap();