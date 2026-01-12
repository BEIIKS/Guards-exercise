import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url, UrlDocument, UrlStatus } from '@libs/schemas';
import axios from 'axios';

@Injectable()
export class UrlFetcherService {
  constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>) { }

  async processUrl(id: string, url: string) {
    try {
      const response = await axios.get(url);
      await this.urlModel.findByIdAndUpdate(id, {
        status: UrlStatus.SUCCESS,
        content: this.castToString(response.data),
        updatedAt: new Date(),
      });
      console.log(`Successfully processed URL: ${url}`);
    } catch (error) {
      console.error(`Failed to process URL: ${url}`, error.message);
      await this.urlModel.findByIdAndUpdate(id, {
        status: UrlStatus.FAIL,
        updatedAt: new Date(),
      });
    }
  }

  private castToString(data: any): string {
    if (typeof data === 'string')
      return data;

    try {
      const result = JSON.stringify(data);
      if (result === undefined)
        return String(data);
      return result;
    } catch {
      return String(data);
    }
  }
}
