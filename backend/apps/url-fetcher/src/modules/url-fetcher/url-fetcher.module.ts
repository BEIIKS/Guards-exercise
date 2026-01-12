import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseModule } from '@libs/database';
import { Url, UrlSchema } from '@libs/schemas';
import { UrlFetcherController } from './url-fetcher.controller';
import { UrlFetcherService } from './url-fetcher.service';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
  ],
  controllers: [UrlFetcherController],
  providers: [UrlFetcherService],
})
export class UrlFetcherModule { }
