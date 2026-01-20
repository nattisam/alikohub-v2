import { Controller, Post, UseInterceptors, UploadedFile, Body, Inject, BadRequestException, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import FormData = require('form-data');
import { ApiTags, ApiConsumes, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../common/guard/firebase_auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('upload')
@ApiTags('File Upload')
@UseGuards(AuthGuard)
export class FileUploadController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload an image' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.proxyUpload(file, 'image');
  }

  @Post('document')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a document (PDF, Word)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadDocument(@UploadedFile() file: Express.Multer.File) {
    return this.proxyUpload(file, 'document');
  }

  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a video' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    return this.proxyUpload(file, 'video');
  }

  private async proxyUpload(file: Express.Multer.File, type: string) {
    if (!file) throw new BadRequestException('File is required');

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    formData.append('type', type);

    try {
      // Get URL from config or default to local port 3009
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
       console.error('File Upload Proxy Error:', error.message);
       if (error.response) {
         throw new HttpException(error.response.data, error.response.status);
       }
       throw new BadRequestException('File upload failed');
    }
  }
}
