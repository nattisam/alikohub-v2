import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FileModule } from './file/file.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: process.env.UPLOAD_PATH || join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    FileModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
