import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { FileUploadController } from './file-upload.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { FileUploadService } from './file-upload.service';

@Global()
@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
