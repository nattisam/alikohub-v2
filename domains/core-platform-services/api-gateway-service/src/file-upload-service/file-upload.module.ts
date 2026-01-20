import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { FileUploadController } from './file-upload.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [FileUploadController],
  providers: [],
})
export class FileUploadModule {}
