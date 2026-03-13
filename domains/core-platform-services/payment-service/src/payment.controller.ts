import { Controller, Post, Body, BadRequestException, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './transactions/transaction.service';
import { ChapaService } from './gateways/chapa.service';
import { StripeService } from './gateways/stripe.service';
import { InitializePaymentDto } from './common/dto/initialize-payment.dto';
import { PaymentProvider } from './generated/client';
import { v4 as uuidv4 } from 'uuid';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly transactionService: TransactionService,
    private readonly chapaService: ChapaService,
    private readonly stripeService: StripeService,
  ) {}

  @MessagePattern({ cmd: 'initialize_payment' })
  async initialize(@Payload() data: InitializePaymentDto & { userId?: string }) {
    this.logger.log(`Initializing payment for ${data.email} via ${data.provider}`);

    try {
      const reference = uuidv4();
      this.logger.log(`Generated reference: ${reference}`);
      
      // 1. Persist transaction
      this.logger.log(`Persisting transaction to DB...`);
      await this.transactionService.createTransaction({
        amount: data.amount,
        currency: data.currency,
        provider: data.provider,
        reference,
        userId: data.userId,
        purpose: data.purpose,
        metadata: data.metadata,
      });
      this.logger.log(`Transaction persisted.`);

      // 2. Call gateway
      let response;
      if (data.provider === PaymentProvider.CHAPA) {
        this.logger.log(`Calling Chapa gateway...`);
        response = await this.chapaService.initializeTransaction({
            ...data,
            reference
        });
        this.logger.log(`Chapa response received.`);
      } else if (data.provider === PaymentProvider.STRIPE) {
        this.logger.log(`Calling Stripe gateway...`);
        response = await this.stripeService.initializeTransaction({
            ...data,
            reference
        });
        this.logger.log(`Stripe response received.`);
      } else {
        throw new BadRequestException('Unsupported payment provider');
      }

      // 3. Update provider reference if needed
      if (response.providerReference) {
          this.logger.log(`Updating provider reference: ${response.providerReference}`);
          await this.transactionService.updateProviderReference(reference, response.providerReference);
          this.logger.log(`Provider reference updated.`);
      }

      return {
        reference,
        checkoutUrl: response.checkoutUrl,
      };
    } catch (error) {
      this.logger.error(`Payment initialization failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
