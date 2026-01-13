import { ApiProperty } from '@nestjs/swagger';

export class UrlsSubmitDto {
  @ApiProperty({
    description: 'List of URLs to fetch',
    example: ['https://google.com', 'https://example.com'],
    type: [String],
  })
  urls: string[];
}

export type UrlProcessPayload = Record<string, string>;
