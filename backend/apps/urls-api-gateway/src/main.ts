import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('URL Fetcher API')
    .setDescription('The URL Fetcher API Gateway')
    .setVersion('1.0')
    .addTag('url')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('URLS_API_GATEWAY_PORT') ?? 3000);
}
bootstrap();
