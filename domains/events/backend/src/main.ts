import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(AppModule, {
        transport: Transport.TCP,
        options: {
            host: process.env.EVENTS_SERVICE_HOST || 'localhost',
            port: parseInt(process.env.EVENTS_SERVICE_PORT, 10) || 3004,
        },
    });
    await app.listen();
}
bootstrap();