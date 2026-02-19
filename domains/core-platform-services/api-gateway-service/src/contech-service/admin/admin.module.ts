import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AdminController } from './admin.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [AdminController],
})
export class AdminModule {}
