import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
  UploadApiOptions,
} from 'cloudinary';
import { Readable } from 'stream';

// Import Multer's file type directly
import { File as MulterFile } from 'multer';

// Define a type alias for Multer's file object for clarity
export type MulterFile = MulterFile;

@Injectable()
export class CloudinaryService {
  constructor(private readonly config: ConfigService) {
    // Constructor is now more concise using private readonly
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: MulterFile,
    options?: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    // Enforce the resource_type as 'image' and merge with any provided options
    const uploadOptions: UploadApiOptions = {
      ...options,
      resource_type: 'image',
    };
    return this.uploadStream(file.buffer, uploadOptions);
  }

  async uploadRaw(
    file: MulterFile,
    options?: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    // Enforce the resource_type as 'raw' and merge with any provided options
    const uploadOptions: UploadApiOptions = {
      ...options,
      resource_type: 'raw',
    };
    return this.uploadStream(file.buffer, uploadOptions);
  }

  private uploadStream(
    buffer: Buffer,
    options: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        options,
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            return reject(new InternalServerErrorException(error.message));
          }
          if (result) {
            resolve(result);
          } else {
            reject(
              new InternalServerErrorException(
                'No result returned from Cloudinary upload.',
              ),
            );
          }
        },
      );
      const readableStream = new Readable();
      const safeBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
      readableStream.push(safeBuffer);
      readableStream.push(null);
      readableStream.pipe(upload);
    });
  }
}
