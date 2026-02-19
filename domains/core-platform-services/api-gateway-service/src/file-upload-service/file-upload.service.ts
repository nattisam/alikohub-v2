import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import FormData = require('form-data');

@Injectable()
export class FileUploadService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(file: Express.Multer.File, type: 'image' | 'document' | 'video'): Promise<any> {
    if (!file) throw new BadRequestException('File is required');

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    formData.append('type', type);

    try {
      const serviceHost = this.configService.get('FILE_UPLOAD_SERVICE_HOST') || 'localhost';
      const servicePort = this.configService.get('FILE_UPLOAD_SERVICE_PORT') || '3009';
      const serviceUrl = `http://${serviceHost}:${servicePort}`;
      
      const response = await firstValueFrom(
        this.httpService.post(`${serviceUrl}/files/upload`, formData, {
          headers: {
            ...formData.getHeaders(),
          },
        })
      );
      return response.data;
    } catch (error: any) {
      console.error(`File Upload Error (${type}):`, error.message);
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new BadRequestException(`File upload failed for ${type}`);
    }
  }
}
