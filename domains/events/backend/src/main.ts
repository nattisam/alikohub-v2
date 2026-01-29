import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { AppLogger } from './logger';
import { EventsProfileGuard } from './auth';
import { ValidationPipe } from '@nestjs/common';
import { RpcExceptionFilter } from './common/filters/rpc-exception.filter';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(AppModule, {
        transport: Transport.TCP,
        options: {
            host: process.env.EVENTS_SERVICE_HOST || '0.0.0.0', // Updated to listen on all interfaces
            port: parseInt(process.env.EVENTS_SERVICE_PORT as string, 10) || 3004,
        },
        logger: new AppLogger(),
    });

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

    // Apply global guard
    app.useGlobalGuards(app.get(EventsProfileGuard));

    await app.listen();
}
bootstrap();