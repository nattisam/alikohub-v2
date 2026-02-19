import { Module } from '@nestjs/common';
import { PromotionRequestsService } from './promotion-requests.service';
import { PromotionRequestsController } from './promotion-requests.controller';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from '../database/database.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    UserModule, 
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.AUTH_SERVICE_PORT as string) || 3001,
        },
      },
    ]),
  ],
  controllers: [PromotionRequestsController],
  providers: [PromotionRequestsService],
})
export class PromotionRequestsModule {}
