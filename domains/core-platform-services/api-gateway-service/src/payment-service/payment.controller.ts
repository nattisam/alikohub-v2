import { Controller, Get, Post, Body, Inject, Request, UseGuards, RawBodyRequest, Req, Headers, Logger, BadRequestException, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '../common/guard/firebase_auth.guard';
import { RequestWithUser } from '../common/types/request-with-user.interface';
import { lastValueFrom } from 'rxjs';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(@Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientProxy) {}

  @Post('initialize')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Initialize a payment transaction' })
  async initialize(@Request() req: RequestWithUser, @Body() data: any) {
    if (!req.user) {
        throw new BadRequestException('User identification required');
    }
    return lastValueFrom(
      this.paymentClient.send({ cmd: 'initialize_payment' }, {
        ...data,
        userId: req.user.firebaseId,
      })
    );
  }

  // Webhooks are public - the verification happens in the microservice
  @Post('webhooks/chapa')
  @ApiOperation({ summary: 'Chapa webhook callback (POST)' })
  async chapaWebhook(@Body() data: any, @Headers('x-chapa-signature') signature: string) {
    this.logger.log(`Forwarding Chapa POST webhook for reference: ${data.tx_ref || data.reference}`);
    return lastValueFrom(
      this.paymentClient.send({ cmd: 'webhook_chapa' }, { data, signature })
    );
  }

  @Get('webhooks/chapa')
  @ApiOperation({ summary: 'Chapa callback redirect (GET)' })
  async chapaRedirect(@Query('trx_ref') txRef: string, @Query('tx_ref') txRefAlt: string) {
    const reference = txRef || txRefAlt;
    this.logger.log(`Received Chapa GET redirect for reference: ${reference}`);
    
    if (reference) {
      // We also trigger a verification on GET redirect for immediate user feedback
      // This is helpful if the background webhook is delayed.
      try {
        await lastValueFrom(
          this.paymentClient.send({ cmd: 'webhook_chapa' }, { data: { tx_ref: reference }, signature: 'none' })
        );
      } catch (err: any) {
        this.logger.warn(`Immediate verification on redirect failed: ${err.message}`);
      }
    }

    return {
      message: 'Payment status is being processed. Thank you!',
      action: 'You can now return to your courses page to access your content.',
      reference
    };
  }

  // Stripe needs Raw Body for signature verification
  @Post('webhooks/stripe')
  @ApiOperation({ summary: 'Stripe webhook callback' })
  async stripeWebhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') signature: string) {
    this.logger.log('Forwarding Stripe webhook');
    return lastValueFrom(
        this.paymentClient.send({ cmd: 'webhook_stripe' }, { 
            data: req.rawBody, 
            signature 
        })
    );
  }
}
