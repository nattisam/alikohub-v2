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

  @MessagePattern('webhook_stripe')
  async handleWebhook(@Payload() payload: { data: any, signature: string }) {
    const { data, signature } = payload;
    this.logger.log('Processing Stripe webhook via message pattern');

    // Signature verification requires the raw body (data should be the buffer/string)
    const verification = await this.stripeService.verifyWebhook(data, signature);

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
