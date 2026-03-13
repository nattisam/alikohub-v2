import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
  UploadApiOptions,
} from 'cloudinary';
import { Readable } from 'stream';

// Define the Multer file type directly
export type MulterFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename?: string;
  path?: string;
  buffer: Buffer;
};

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly config: ConfigService) {
    // Constructor is now more concise using private readonly
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    });

    this.logger.log('Cloudinary service initialized with config:', {
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
    });
  }

  async uploadImage(
    file: MulterFile,
    options?: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    this.logger.log(`Uploading image to Cloudinary: ${file.originalname}`);

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
    this.logger.log(`Uploading raw file to Cloudinary: ${file.originalname}`);

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
            this.logger.error('Cloudinary upload error:', error);
            return reject(new InternalServerErrorException(error.message));
          }
          if (result) {
            this.logger.log('Cloudinary upload successful:', {
              url: result.secure_url,
              public_id: result.public_id,
            });
            resolve(result);
          } else {
            const errorMsg = 'No result returned from Cloudinary upload.';
            this.logger.error(errorMsg);
            reject(new InternalServerErrorException(errorMsg));
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
