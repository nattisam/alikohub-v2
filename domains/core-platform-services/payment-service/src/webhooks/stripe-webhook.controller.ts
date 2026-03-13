import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StripeService } from '../gateways/stripe.service';
import { TransactionService } from '../transactions/transaction.service';

@Controller()
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  constructor(
    private readonly stripeService: StripeService,
    private readonly transactionService: TransactionService,
  ) {}

  @MessagePattern({ cmd: 'webhook_stripe' })
  async handleWebhook(@Payload() payload: any) {
    const { data, signature } = payload;
    this.logger.log(`Processing Stripe webhook. Signature: ${signature ? 'present' : 'missing'}`);
    
    let rawData = data;
    if (data && data.type === 'Buffer') {
        rawData = Buffer.from(data.data);
        this.logger.log('Converted Stripe payload from Buffer object');
    } else if (typeof data === 'string' || Buffer.isBuffer(data)) {
        this.logger.log(`Stripe payload is ${typeof data === 'string' ? 'string' : 'Buffer'}`);
    } else {
        this.logger.log(`Stripe payload type: ${typeof data}. Keys: ${Object.keys(data || {})}`);
        rawData = JSON.stringify(data);
    }

    const verification = await this.stripeService.verifyWebhook(rawData, signature);

    if (verification.isValid) {
      if (verification.status === 'COMPLETED') {
        await this.transactionService.handleWebhookSuccess(verification.providerReference, verification.amount);
      } else if (verification.status === 'FAILED' || verification.status === 'CANCELLED') {
          // Stripe sessions can expire or be cancelled
          await this.transactionService.handleWebhookFailure(verification.providerReference);
      }
      return { received: true };
    }

    return { received: false, error: 'Invalid signature' };
  }
}
