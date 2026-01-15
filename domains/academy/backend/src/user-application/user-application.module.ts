import { Global, Module } from '@nestjs/common';
import { UserApplicationController } from './user-application.controller';
import { UserApplicationService } from './user-application.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  controllers: [UserApplicationController],
  providers: [UserApplicationService],
})
export class UserApplicationModule {}
