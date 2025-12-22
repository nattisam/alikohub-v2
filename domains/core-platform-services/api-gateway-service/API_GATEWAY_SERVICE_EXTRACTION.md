# API Gateway Service Extraction

## Project Structure Context
**Source Location**: `domains/core-platform-services/api-gateway-service/`

## Essential Structure for Reimplementation

### Package Dependencies
```json
{
  "dependencies": {
    "@nestjs/common": "^11.0.1",
    "@nestjs/config": "^4.0.2",
    "@nestjs/core": "^11.0.1",
    "@nestjs/microservices": "^11.1.6",
    "@nestjs/platform-express": "^11.0.1",
    "@nestjs/swagger": "^11.2.3",
    "@prisma/client": "^6.15.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.2",
    "cookie-parser": "^1.4.7",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "swagger-ui-express": "^5.0.1"
  }
}
```

### Core Module Structure

#### App Module (src/app.module.ts)
**Location**: `domains/core-platform-services/api-gateway-service/src/app.module.ts`
```typescript
import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_SERVICE_HOST'),
            port: configService.get('AUTH_SERVICE_PORT'),
          },
        }),
      },
      // Add other services similarly...
    ]),
    // Import service modules...
  ],
  exports: [ClientsModule],
})
export class AppModule { }
```

#### Main Bootstrap (src/main.ts)
**Location**: `domains/core-platform-services/api-gateway-service/src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.use(cookieParser());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('Gateway documentation for frontend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3006, '0.0.0.0');
}
bootstrap();
```

### Common Components

#### Global Roles Enum (common/roles/roles.enum.ts)
**Location**: `domains/core-platform-services/api-gateway-service/common/roles/roles.enum.ts`
```typescript
export enum GlobalRole {
    USER = "USER",
    ADMIN = "ADMIN"
}
```

#### Firebase Auth Guard (common/guard/firebase_auth.guard.ts)
**Location**: `domains/core-platform-services/api-gateway-service/common/guard/firebase_auth.guard.ts`
```typescript
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom, timeout, catchError } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const sessionCookie = request.cookies?.session;

    if (!sessionCookie) {
      throw new UnauthorizedException('Session cookie not provided');
    }

    try {
      const authResponse = await firstValueFrom(
        this.authClient
          .send({ cmd: 'verify' }, { type: 'cookie', value: sessionCookie })
          .pipe(timeout(5000))
      );
      
      if (!authResponse?.user) {
        throw new UnauthorizedException('Invalid session');
      }

      request['user'] = authResponse.user;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
```

#### Role Guard (common/roles/roles.guard.ts)
**Location**: `domains/core-platform-services/api-gateway-service/common/roles/roles.guard.ts`
```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { GlobalRole } from './roles.enum';

type AuthenticatedUser = {
  firebaseId: string;
  globalRole: GlobalRole;
};

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<GlobalRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthenticatedUser = request.user;

    if (!user || !user.globalRole) {
      return false;
    }

    return requiredRoles.some((role) => user.globalRole === role);
  }
}
```

#### Roles Decorator (common/roles/roles.decorator.ts)
**Location**: `domains/core-platform-services/api-gateway-service/common/roles/roles.decorator.ts`
```typescript
import { SetMetadata } from '@nestjs/common';
import { GlobalRole } from './roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: GlobalRole[]) => SetMetadata(ROLES_KEY, roles);
```

### Exception Filter

#### RPC Exception Filter (src/filters/rpc-exception.filter.ts)
**Location**: `domains/core-platform-services/api-gateway-service/src/filters/rpc-exception.filter.ts`
```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof RpcException) {
      const rpcError = exception.getError();
      statusCode = HttpStatus.BAD_REQUEST;
      message = typeof rpcError === 'string' ? rpcError : 'RPC Error';
    }
    else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

### Environment Variables Required
**Location**: `domains/core-platform-services/api-gateway-service/.env`
```
AUTH_SERVICE_HOST=auth-service
AUTH_SERVICE_PORT=3000
ACADEMY_SERVICE_HOST=academy-backend
ACADEMY_SERVICE_PORT=3000
CONTECH_SERVICE_HOST=contech-backend
CONTECH_SERVICE_PORT=3000
EVENTS_SERVICE_HOST=events-backend
EVENTS_SERVICE_PORT=3000
CAREERS_SERVICE_HOST=careers-service
CAREERS_SERVICE_PORT=3000
PORT=3006
```

### TypeScript Configuration
**Location**: `domains/core-platform-services/api-gateway-service/tsconfig.json`
```json
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "declaration": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "target": "ES2023",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "strict": true
  }
}
```

### Key Features
- TCP microservice communication
- Firebase authentication via auth service
- Role-based authorization
- Swagger API documentation
- Global exception handling
- CORS support
- Cookie-based authentication

## Service Module Examples

### User Module (src/auth-service/user/user.module.ts)
**Location**: `domains/core-platform-services/api-gateway-service/src/auth-service/user/user.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController]
})
export class UserModule {}
```

### User Controller (src/auth-service/user/user.controller.ts)
**Location**: `domains/core-platform-services/api-gateway-service/src/auth-service/user/user.controller.ts`
```typescript
import { Controller, Get, Inject, UseGuards, Request, Body, Patch, Delete, Param, ForbiddenException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from 'common/guard';
import { Roles } from 'common/roles/roles.decorator';
import { RoleGuard } from 'common/roles/roles.guard';
import { UpdateUserDto } from './dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
    constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

    @Get('all')
    @UseGuards(RoleGuard)
    @Roles('ADMIN')
    getAllUsers(@Request() req) {
        return this.authClient.send({ cmd: 'get_all_users' }, { requestingUser: req.user });
    }

    @Get('profile')
    getProfile(@Request() req) {
        return this.authClient.send({ cmd: "get_user_profile" }, { firebaseId: req.user.firebaseId });
    }

    @Patch('profile')
    updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
        const payload = { firebaseId: req.user.firebaseId, dto };
        return this.authClient.send({ cmd: "update_user_profile" }, payload);
    }

    @Patch(':id')
    updateUserById(@Request() req, @Param('id') id: string, @Body() dto: UpdateUserDto) {
        if (req.user.firebaseId !== id && req.user.globalRole !== 'ADMIN') {
            throw new ForbiddenException('You can only update your own profile');
        }
        const payload = { firebaseId: id, dto };
        return this.authClient.send({ cmd: "update_user_by_id" }, payload);
    }

    @Delete('profile')
    deleteProfile(@Request() req) {
        return this.authClient.send({ cmd: "delete_user_profile" }, { firebaseId: req.user.firebaseId });
    }
}
```
