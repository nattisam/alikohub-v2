import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // For Stripe webhooks signature verification, we need the raw body
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  const TCP_PORT = parseInt(process.env.PAYMENT_SERVICE_PORT) || 3012;
  const HTTP_PORT = 4012;

  // Set up as a microservice for internal IPC (via TCP or RMQ)
  // Here we use TCP for simple Gateway -> Service comms, 
  // though we also use RMQ for events in AppModule.
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: TCP_PORT,
    },
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  await app.startAllMicroservices();
  await app.listen(HTTP_PORT, '0.0.0.0');
  
  logger.log(`Payment microservice: TCP port ${TCP_PORT}, HTTP port ${HTTP_PORT}`);
}

bootstrap();
