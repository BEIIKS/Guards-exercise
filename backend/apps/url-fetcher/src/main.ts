import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { getMicroserviceConfig } from '@libs/messaging';

import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>(
    getMicroserviceConfig(configService.get<string>(
      'URL_FETCHER_CONSUMER_GROUP',
    ) ?? 'url-fetcher-consumer'),
  );

  await app.startAllMicroservices();
}
bootstrap();
