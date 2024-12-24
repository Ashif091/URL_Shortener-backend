import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url } from 'src/schemas/url.schema';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private readonly urlModel: Model<Url>) {}

  async createUrl(userId: string, url: string, shorterUrl: string): Promise<Url> {
    const newUrl = new this.urlModel({ userId, url, shorterUrl });
    return newUrl.save();
  }

  async getUrls(userId: string): Promise<Url[]> {
    return this.urlModel.find({ userId }).exec();
  }

  async editUrl(userId: string, id: string, updatedUrl: string, updatedShorterUrl: string): Promise<Url> {
    const url = await this.urlModel.findOneAndUpdate(
      { _id: id, userId },
      { url: updatedUrl, shorterUrl: updatedShorterUrl },
      { new: true },
    );
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    return url;
  }

  async deleteUrl(userId: string, id: string): Promise<void> {
    const result = await this.urlModel.deleteOne({ _id: id, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('URL not found');
    }
  }
  async getUrlByShorterUrl(shorterUrl: string): Promise<string> {
    const urlDoc = await this.urlModel.findOne({ shorterUrl }).exec();
    console.log("🚀 ~ UrlService ~ getUrlByShorterUrl ~ urlDoc:", urlDoc)
    if (!urlDoc) {
        return null
    }
    return urlDoc.url;
  }
} 
