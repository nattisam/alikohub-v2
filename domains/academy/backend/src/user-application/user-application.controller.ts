import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { UserApplicationService } from './user-application.service';

@Controller()
export class UserApplicationController {
      
      constructor(private readonly applicationService: UserApplicationService) {}
    
      @EventPattern('user.promotion.academy')
      async handleUserPromotion(
        @Payload() payload: { userId: string; role: string }
      ) {
        console.log(`payload received: ${payload}`)
        await this.applicationService.updateUserRole(payload.userId, payload.role);

      }
}
