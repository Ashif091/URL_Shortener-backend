// src/url-shortener/url.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { UrlService } from './url.service';
import { Request } from 'express';
import * as CryptoJS from 'crypto-js'; 
import { v4 as uuidv4 } from 'uuid'; 

@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}
    
  @Post('create')
  async createUrl(@Body('url') url: string, @Req() req: Request) {
    const userId = req.user as string;
    let key: string;
    let isUnique = false;

    while (!isUnique) {
      key = this.generateBase64Key(url + userId);
      const existingUrl = await this.urlService.getUrlByShorterUrl(key);
      if (!existingUrl) {
        isUnique = true;
      }
    }
    const newUrl = await this.urlService.createUrl(userId, url, key);
    return { message: 'URL created successfully', newUrl };
  }

  @Get()
  async getUrls(@Req() req: Request) {
    const userId = req.user as string; 
    const urls = await this.urlService.getUrls(userId);
    return { urls };
  }
  @Get(':url')
  async getOrgUrls(@Param('url') url: string,@Req() req: Request) {
    if(!url) return null
     
    const originalUrl = await this.urlService.getUrlByShorterUrl(url)
    return originalUrl;
  }

  @Put(':id')
  async editUrl(
    @Param('id') id: string,
    @Body('url') updatedUrl: string,
    @Body('shorterUrl') updatedShorterUrl: string,
    @Req() req: Request,
  ) {
    const userId = req.user as string; 
    const updated = await this.urlService.editUrl(userId, id, updatedUrl, updatedShorterUrl);
    return { message: 'URL updated successfully', updated };
  }

  @Delete(':id')
  async deleteUrl(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user as string; 
    await this.urlService.deleteUrl(userId, id);
    return { message: 'URL deleted successfully' };
  }
  private generateBase64Key(input: string): string {
    const privateKey = 'ABCsfgzdfsjNOPQRSTUVWXYdsfZabcdefghijklmnopqrstuvdfdfdfwxyz0123456789'; 
    const uniqueInput = input + uuidv4(); 
    console.log("🚀 ~ UrlController ~ generateBase64Key ~ uniqueInput:", uniqueInput)
    const hmacDigest = CryptoJS.HmacSHA512(uniqueInput, privateKey);
    const base64String = CryptoJS.enc.Base64.stringify(hmacDigest);
    const base62Key = base64String
    .replace(/[^a-zA-Z0-9]/g, '') 
    .substring(0, 6); 
    console.log("🚀 ~ UrlController ~ generateBase64Key ~ base62Key:", base62Key)
  
    return base62Key;
  }
}
