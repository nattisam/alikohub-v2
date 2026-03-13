import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { 
  PaymentServiceInterface, 
  InitTransactionDto, 
  InitSessionResponse, 
  WebhookVerificationResult 
} from '../interfaces/payment-service.interface';

@Injectable()
export class StripeService implements PaymentServiceInterface {
  private readonly logger = new Logger(StripeService.name);
  private readonly stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET'), {
      // apiVersion: '2025-01-27-ac', // Use latest stable
    } as any);
  }

  async initializeTransaction(data: InitTransactionDto): Promise<InitSessionResponse> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: data.currency.toLowerCase(),
              product_data: {
                name: data.purpose || 'Payment',
              },
              unit_amount: Math.round(data.amount * 100), // Stripe uses cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: this.configService.get('STRIPE_SUCCESS_URL'),
        cancel_url: this.configService.get('STRIPE_CANCEL_URL'),
        customer_email: data.email,
        client_reference_id: data.reference,
        metadata: data.metadata,
      });

      return {
        checkoutUrl: session.url,
        providerReference: session.id,
      };
    } catch (error) {
      this.logger.error(`Stripe initialization error: ${error.message}`);
      throw error;
    }
  }

  async verifyWebhook(payload: any, signature: string): Promise<WebhookVerificationResult> {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.configService.get<string>('STRIPE_WEBHOOK_SECRET'),
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        return {
          isValid: true,
          status: 'COMPLETED',
          providerReference: session.id,
          amount: session.amount_total / 100,
        };
      }

      return {
        isValid: true, // Signature was valid but event not handled here
        status: 'PENDING',
        providerReference: '',
        amount: 0,
      };
    } catch (error) {
      this.logger.error(`Stripe webhook verification error: ${error.message}`);
      return {
        isValid: false,
        status: 'FAILED',
        providerReference: '',
        amount: 0,
      };
    }
  }
}
