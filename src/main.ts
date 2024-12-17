import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { requestLogger } from './common/middleware/request-logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(requestLogger);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
