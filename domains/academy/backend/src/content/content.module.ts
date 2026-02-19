import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ContentAccessGuard } from './guards/content-access.guard';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'FILE_UPLOAD_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('FILE_UPLOAD_SERVICE_HOST'),
            port: 3019, // configService.get('FILE_UPLOAD_SERVICE_PORT'),
          },
        }),
      },
    ]),
  ],
  controllers: [ContentController],
  providers: [ContentService, ContentAccessGuard, PrismaService],
  exports: [ClientsModule],
})
export class ContentModule {}
