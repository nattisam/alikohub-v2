import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { FileUploadController } from './file-upload.controller';
import { FileProxyController } from './file-proxy.controller';
import { FileUploadService } from './file-upload.service';

@Global()
@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [FileUploadController, FileProxyController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
