import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  Get,
  Param,
  Res,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../../common/guard';
import type { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('File Upload')
@Controller('academy/upload')
export class FileUploadController {
  private readonly logger = new Logger(FileUploadController.name);

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });

    this.logger.log('FileUploadController initialized with Cloudinary config');
  }

  @Post('image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload an image file',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    this.logger.log('Received upload request', {
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    });

    try {
      const folder = 'academy/courses';
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: 'image' },
          (error, result) => {
            if (error) {
              this.logger.error('Cloudinary upload error', error);
              return reject(error);
            }
            this.logger.log('Cloudinary upload successful', {
              url: result?.secure_url,
              publicId: result?.public_id,
            });
            resolve(result);
          },
        );
        stream.end(file.buffer);
      });

      const result = {
        message: 'File uploaded successfully',
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };

      this.logger.log('Returning upload result', result);
      return result;
    } catch (error) {
      this.logger.error('Error uploading file', error);
      throw error;
    }
  }

  @Get('image/:filename')
  redirectToCloudinary(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    this.logger.log('Received image request', { filename });
    // Redirect to a placeholder image if not found
    return res.redirect(
      'https://placehold.co/600x400/cccccc/000000?text=Image+Not+Found',
    );
  }
}
