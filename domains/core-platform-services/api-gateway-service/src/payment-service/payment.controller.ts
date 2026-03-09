import { Controller, Post, Body, Inject, Request, UseGuards, RawBodyRequest, Req, Headers, Logger, BadRequestException } from '@nestjs/common';
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
  @ApiOperation({ summary: 'Chapa webhook callback' })
  async chapaWebhook(@Body() data: any, @Headers('x-chapa-signature') signature: string) {
    this.logger.log('Forwarding Chapa webhook');
    // For webhooks, we usually want to trigger it and not wait for a full response if it takes too long,
    // but here we wait for the microservice to verify and return 200.
    return lastValueFrom(
      this.paymentClient.send('webhook_chapa', { data, signature }) // Using a different pattern for webhooks if needed
    );
  }

  // Stripe needs Raw Body for signature verification
  @Post('webhooks/stripe')
  @ApiOperation({ summary: 'Stripe webhook callback' })
  async stripeWebhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') signature: string) {
    this.logger.log('Forwarding Stripe webhook');
    return lastValueFrom(
        this.paymentClient.send('webhook_stripe', { 
            data: req.rawBody, 
            signature 
        })
    );
  }
}
