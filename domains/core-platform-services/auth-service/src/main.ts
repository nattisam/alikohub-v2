
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogger } from './logger';
import { ValidationPipe } from '@nestjs/common';
import { TestAuthMiddleware } from './modules/auth/test-auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new AppLogger(),
  });
  
  // Enable request logging
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
  });
  
  // Enable CORS for frontend access
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8080', 'http://localhost:4200'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-test-user'],
  });
  
  // Add test auth middleware for RBAC testing
  const testAuthMiddleware = new TestAuthMiddleware();
  app.use('/rbac', (req, res, next) => testAuthMiddleware.use(req, res, next));
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3000);
  console.log('Auth service running on http://localhost:3000');
}
bootstrap();

