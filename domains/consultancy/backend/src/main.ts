import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const TCP_PORT = parseInt(process.env.PORT, 10) || 3006;
  const HTTP_PORT = TCP_PORT + 1000; // 4006

  // TCP transport — Gateway communication
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: TCP_PORT,
    },
  });

  // RabbitMQ transport — Auth event consumption
  const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
  if (process.env.RABBITMQ_ENABLED !== 'false') {
    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: 'consultancy_user_events',
        exchange: 'user_events',
        exchangeType: 'fanout',
        queueOptions: { durable: false },
      },
    });
  }

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api/consultancy');

  await app.startAllMicroservices();
  await app.listen(HTTP_PORT, '0.0.0.0');

  logger.log(`Consultancy TCP listening on port ${TCP_PORT}`);
  logger.log(`Consultancy HTTP listening on port ${HTTP_PORT}`);
}

bootstrap();
