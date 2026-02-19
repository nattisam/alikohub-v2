import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { winstonConfig } from './winston.config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { RpcExceptionFilter } from './common/filters/rpc-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: winstonConfig,
  });

  const port = parseInt(process.env.AUTH_SERVICE_PORT || '3001', 10);
  
  // Centralized Global Error Handling
  app.useGlobalFilters(new RpcExceptionFilter());
  
  // Centralized Validation Handling
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Connect TCP microservice
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: parseInt(process.env.AUTH_TCP_PORT || '3011', 10),
    },
  });

  await app.startAllMicroservices();
  await app.listen(port, '0.0.0.0');
  logger.log(`Auth service running on HTTP port ${port} and TCP port 3011`);
}

bootstrap();

