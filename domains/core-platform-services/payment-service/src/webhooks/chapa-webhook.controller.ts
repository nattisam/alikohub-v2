import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChapaService } from '../gateways/chapa.service';
import { TransactionService } from '../transactions/transaction.service';

@Controller()
export class ChapaWebhookController {
  private readonly logger = new Logger(ChapaWebhookController.name);

  constructor(
    private readonly chapaService: ChapaService,
    private readonly transactionService: TransactionService,
  ) {}

  @MessagePattern('webhook_chapa')
  async handleWebhook(@Payload() payload: { data: any, signature: string }) {
    const { data, signature } = payload;
    this.logger.log(`Received Chapa webhook for reference: ${data.tx_ref}`);
    
    // 1. Verify
    const verification = await this.chapaService.verifyWebhook(data, signature);

    if (verification.isValid) {
      if (verification.status === 'COMPLETED') {
        await this.transactionService.handleWebhookSuccess(verification.providerReference, verification.amount);
      } else {
        await this.transactionService.handleWebhookFailure(verification.providerReference);
      }
      return { received: true };
    }

    return { received: false, error: 'Invalid signature or verification failed' };
  }
}
