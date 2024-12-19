import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { requestLogger } from './common/middleware/request-logger.middleware';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '1mb' }));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(requestLogger);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
