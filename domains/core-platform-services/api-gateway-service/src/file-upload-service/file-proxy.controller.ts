import { Controller, Get, Param, Res, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { Public } from '../common/decorators/public.decorator';

@Controller('uploads')
export class FileProxyController {
  private readonly fileServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get('FILE_UPLOAD_SERVICE_HOST') || 'localhost';
    const port = this.configService.get('FILE_UPLOAD_SERVICE_PORT') || '3009';
    this.fileServiceUrl = `http://${host}:${port}`;
  }

  @Public()
  @Get(':folder/:filename')
  async proxyFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.fileServiceUrl}/uploads/${folder}/${filename}`, {
          responseType: 'stream',
        }),
      );

      // Forward content-type header
      const contentType = response.headers['content-type'];
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      }

      // Forward content-length if available
      const contentLength = response.headers['content-length'];
      if (contentLength) {
        res.setHeader('Content-Length', contentLength);
      }

      // Cache static assets for 1 day
      res.setHeader('Cache-Control', 'public, max-age=86400');

      response.data.pipe(res);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to retrieve file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
