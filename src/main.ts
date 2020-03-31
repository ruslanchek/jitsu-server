require('dotenv').config();

import { ENV } from './env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('http');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(ENV.PORT);
}
bootstrap();
