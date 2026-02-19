import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { JobsModule } from './jobs/jobs.module';
import { UserModule } from './user/user.module';
import * as path from 'path';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '..', '.env'),
    }),
    PrismaModule,
    JobsModule,
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
