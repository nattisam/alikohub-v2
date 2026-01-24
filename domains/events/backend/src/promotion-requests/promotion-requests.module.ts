import { Module } from '@nestjs/common';
import { PromotionRequestsService } from './promotion-requests.service';
import { PromotionRequestsController } from './promotion-requests.controller';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [UserModule, DatabaseModule],
  controllers: [PromotionRequestsController],
  providers: [PromotionRequestsService],
})
export class PromotionRequestsModule {}
