import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { connect, AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: AmqpConnectionManager;
  private channel: ChannelWrapper;

  async onModuleInit() {
    this.connection = connect([process.env.RABBITMQ_URL || 'amqp://localhost']);
    this.channel = this.connection.createChannel({ json: true });
    await this.channel.waitForConnect();
  }

  async sendToQueue(queue: string, message: any) {
    await this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }

  async onModuleDestroy() {
    await this.connection.close();
  }
}
