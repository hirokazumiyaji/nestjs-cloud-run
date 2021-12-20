import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';
import * as metadata from 'gcp-metadata';
import { AppModule } from './app.module';

async function bootstrap() {
  if (await metadata.isAvailable()) {
    process.env.GCP_PROJECT = await metadata.project('project-id');
  }

  const port = process.env.PORT ? +process.env.PORT : 3000;
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    logger: false,
  });
  app.useLogger(app.get(Logger));
  await app.listen(port, '0.0.0.0');
}

bootstrap();
