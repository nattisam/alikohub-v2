import { Controller, Post, UseInterceptors, UploadedFile, Inject, BadRequestException, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../common/guard/firebase_auth.guard';
import { FileUploadService } from './file-upload.service';

@Controller('upload')
@ApiTags('File Upload')
@UseGuards(AuthGuard)
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService
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
    return this.fileUploadService.uploadFile(file, 'image');
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
    return this.fileUploadService.uploadFile(file, 'document');
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
    return this.fileUploadService.uploadFile(file, 'video');
  }
}
