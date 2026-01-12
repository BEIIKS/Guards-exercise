import { Module } from '@nestjs/common';
import { MessagingModule } from '@libs/messaging';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseModule } from '@libs/database';
import { Url, UrlSchema } from '@libs/schemas';
import { UrlsApiGatewayController } from './urls-api-gateway.controller';
import { UrlsApiGatewayService } from './urls-api-gateway.service';

@Module({
  imports: [
    MessagingModule.register({ clientId: 'urls-api-gateway' }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
  ],
  controllers: [UrlsApiGatewayController],
  providers: [UrlsApiGatewayService],
})
export class UrlsApiGatewayModule { }
