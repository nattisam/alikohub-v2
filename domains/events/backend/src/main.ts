import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { AppLogger } from './logger';
import { EventsProfileGuard } from './auth';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(AppModule, {
        transport: Transport.TCP,
        options: {
            host: process.env.EVENTS_SERVICE_HOST || '0.0.0.0', // Updated to listen on all interfaces
            port: parseInt(process.env.EVENTS_SERVICE_PORT as string, 10) || 3004,
        },
        logger: new AppLogger(),
    });

    // Apply global guard
    app.useGlobalGuards(app.get(EventsProfileGuard));

    await app.listen();
}
bootstrap();