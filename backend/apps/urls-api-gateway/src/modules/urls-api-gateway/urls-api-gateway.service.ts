import { Injectable, NotFoundException } from '@nestjs/common';
import { Url, UrlDocument, UrlsSubmitDto } from '@libs/schemas';
import { MessagingService, TOPICS } from '@libs/messaging';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UrlsApiGatewayService {
  constructor(
    @InjectModel(Url.name) private urlModel: Model<UrlDocument>,
    private readonly messagingService: MessagingService,
  ) { }

  async handleUrlsSubmit(urlsDto: UrlsSubmitDto) {
    const uniqueUrls = [...new Set(urlsDto.urls)];

    const existingDocs = await this.urlModel
      .find({
        url: { $in: uniqueUrls },
      })
      .select('_id url')
      .exec();

    const existingUrls = new Set(existingDocs.map((doc) => doc.url));

    const newUrls = uniqueUrls.filter((url) => !existingUrls.has(url));

    let newDocs: UrlDocument[] = [];
    if (newUrls.length > 0) {
      const urlObjects = newUrls.map((url) => ({ url }));
      newDocs = (await this.urlModel.insertMany(urlObjects)) as UrlDocument[];
    }

    const allDocs = [...existingDocs, ...newDocs];

    const payloads = allDocs.map((doc) => ({
      key: doc._id.toString(),
      value: { url: doc.url },
    }));
    await this.messagingService.emitMany(TOPICS.URL_FETCH, payloads);
  }

  async findAll(): Promise<Url[]> {
    return this.urlModel.find().select('url status updatedAt').exec();
  }

  async findContentById(id: string): Promise<Url> {
    const doc = await this.urlModel.findById(id).select('content').exec();
    if (!doc) {
      throw new NotFoundException(`Url with ID ${id} not found`);
    }
    return doc;
  }
}
