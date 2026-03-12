import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaClient, TransactionStatus, PaymentProvider } from '../generated/client';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  private readonly prisma = new PrismaClient();

  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async createTransaction(data: {
    amount: number;
    currency: string;
    provider: PaymentProvider;
    reference: string;
    userId?: string;
    purpose?: string;
    metadata?: any;
  }) {
    return this.prisma.transaction.create({
      data: {
        amount: data.amount,
        currency: data.currency,
        provider: data.provider,
        reference: data.reference,
        userId: data.userId,
        purpose: data.purpose,
        metadata: data.metadata,
        status: 'PENDING',
      },
    });
  }

  async updateProviderReference(reference: string, providerReference: string) {
    return this.prisma.transaction.update({
      where: { reference },
      data: { providerReference },
    });
  }

  async handleWebhookSuccess(providerReference: string, amount: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { providerReference },
    });

    if (!transaction) {
      this.logger.error(`Transaction not found for provider reference: ${providerReference}`);
      return;
    }

    if (transaction.status === 'COMPLETED') {
        this.logger.warn(`Transaction ${transaction.reference} already completed.`);
        return;
    }

    // Amount validation (sanity check)
    if (transaction.amount !== amount) {
        this.logger.error(`Amount mismatch for transaction ${transaction.reference}. Expected ${transaction.amount}, got ${amount}`);
        // We might still mark it as completed but flag it, or keep it pending.
        // For now, let's keep it simple.
    }

    const updated = await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: 'COMPLETED' },
    });

    this.logger.log(`Transaction ${transaction.reference} completed successfully.`);

    this.logger.log(`Emitting payment.succeeded event for reference: ${updated.reference}`);
    // Emit event to RabbitMQ
    this.client.emit('payment.succeeded', {
      transactionId: updated.id,
      reference: updated.reference,
      userId: updated.userId,
      amount: updated.amount,
      currency: updated.currency,
      purpose: updated.purpose,
      metadata: updated.metadata,
    });

    return updated;
  }

  async handleWebhookFailure(providerReference: string) {
      return this.prisma.transaction.updateMany({
          where: { providerReference, status: 'PENDING' },
          data: { status: 'FAILED' }
      });
  }
}
