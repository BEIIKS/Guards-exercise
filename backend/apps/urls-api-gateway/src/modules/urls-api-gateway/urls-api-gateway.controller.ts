import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UrlsApiGatewayService } from './urls-api-gateway.service';
import { UrlsSubmitDto } from '@libs/schemas';

@Controller('/url')
export class UrlsApiGatewayController {
  constructor(private readonly urlsApiGatewayService: UrlsApiGatewayService) { }

  @Post()
  async fetchUrl(@Body() urlsDto: UrlsSubmitDto) {
    await this.urlsApiGatewayService.handleUrlsSubmit(urlsDto);
    return urlsDto.urls;
  }

  @Get()
  async getAllUrls() {
    return this.urlsApiGatewayService.findAll();
  }

  @Get(':id')
  async getUrlContentById(@Param('id') id: string) {
    return this.urlsApiGatewayService.findContentById(id);
  }
}
