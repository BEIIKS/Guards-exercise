import { Module } from '@nestjs/common';
import { UrlFetcherModule } from './modules/url-fetcher';
import { CommonConfigModule } from '@libs/config';

@Module({
  imports: [CommonConfigModule, UrlFetcherModule],
})
export class AppModule {}
