import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { getMicroserviceConfig } from '@libs/messaging';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>(
    getMicroserviceConfig('url-fetcher-consumer'),
  );

  await app.startAllMicroservices();
}
bootstrap();
