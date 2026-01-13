import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UrlsApiGatewayService } from './urls-api-gateway.service';
import { UrlsSubmitDto } from '@libs/schemas';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('url')
@Controller('/url')
export class UrlsApiGatewayController {
  constructor(private readonly urlsApiGatewayService: UrlsApiGatewayService) { }

  @Post()
  @ApiOperation({ summary: 'Submit URLs for fetching' })
  @ApiBody({ type: UrlsSubmitDto })
  @ApiResponse({ status: 201, description: 'URLs submitted successfully.' })
  async fetchUrl(@Body() urlsDto: UrlsSubmitDto) {
    await this.urlsApiGatewayService.handleUrlsSubmit(urlsDto);
    return urlsDto.urls;
  }

  @Get()
  @ApiOperation({ summary: 'Get all submitted URLs' })
  @ApiResponse({ status: 200, description: 'Return all URLs.' })
  async getAllUrls() {
    return this.urlsApiGatewayService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get URL content by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the URL entry' })
  @ApiResponse({ status: 200, description: 'Return the URL content.' })
  @ApiResponse({ status: 404, description: 'URL not found.' })
  async getUrlContentById(@Param('id') id: string) {
    return this.urlsApiGatewayService.findContentById(id);
  }
}
