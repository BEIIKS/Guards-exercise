import { Module } from '@nestjs/common';
import { UrlsApiGatewayModule } from './modules/urls-api-gateway';
import { CommonConfigModule } from '@libs/config';

@Module({
  imports: [CommonConfigModule, UrlsApiGatewayModule],
})
export class AppModule {}
