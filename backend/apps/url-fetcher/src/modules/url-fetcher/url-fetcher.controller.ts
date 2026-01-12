import { Controller } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { TOPICS } from '@libs/messaging';
import type { UrlProcessPayload } from '@libs/schemas';
import { UrlFetcherService } from './url-fetcher.service';

@Controller()
export class UrlFetcherController {
  constructor(private readonly urlFetcherService: UrlFetcherService) { }

  @MessagePattern(TOPICS.URL_FETCH)
  handleUrlFetch(
    @Payload() data: UrlProcessPayload,
    @Ctx() context: KafkaContext,
  ) {
    const urlId = context.getMessage().key?.toString();
    const { url } = data;

    if (!urlId) {
      console.error('Received URL fetch request without key');
      return;
    }

    console.log(`Received URL fetch request: ${url} (ID: ${urlId})`);
    this.urlFetcherService.processUrl(urlId, url);
  }
}
