# Reimplementation Guide: API Gateway & Microservice Authentication

This guide details how to reimplement the pattern where an **API Gateway** handles HTTP traffic and centralized authentication, while delegation business logic to **Microservices** (like Auth, ConTech, Events) via **TCP**.

## 1. System Architecture

*   **API Gateway (HTTP)**: Entry point for Frontends. Handles Session validation, Proxying.
*   **Auth Service (TCP)**: Handles User/Firebase verification, Database logic.
*   **Subdomain Services (TCP)**: Handle business logic (e.g., Projects, Events).

**Communication**: `Gateway -> TCP -> Microservice`

## 2. Project Setup (Monorepo)

Structure your new repository as a monorepo (e.g., using Nx or Turborepo, or standard NestJS monorepo).

```text
/
├── apps/
│   ├── api-gateway/       (HTTP Server, Port: 3006)
│   ├── auth-service/      (TCP Microservice, Port: 3001)
│   └── contech-service/   (TCP Microservice, Port: 3002)
├── libs/
│   └── common/            (Shared Guards, DTOs)
```

## 3. Implementation: Auth Service (The Provider)

This service verifies credentials and manages users.

### Dependencies
```bash
npm install @nestjs/microservices @nestjs/passport firebase-admin prisma @prisma/client argon2 cookie-parser
```

### [main.ts](file:///c:/Users/X1/pro/alikohub/alikohub/domains/core-platform-services/auth-service/src/main.ts) (Bootstrap)
Listen on TCP port.

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3001, // Auth Service Port
    },
  });
  await app.listen();
}
bootstrap();
```

### [auth.controller.ts](file:///c:/Users/X1/pro/alikohub/alikohub/domains/core-platform-services/auth-service/src/auth/auth.controller.ts)
Implement [verify](file:///c:/Users/X1/pro/alikohub/alikohub/domains/core-platform-services/auth-service/src/auth/auth.controller.ts#53-56) command pattern.

```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'verify' })
  verify(@Payload() data: { type: 'cookie' | 'token'; value: string }) {
    return this.authService.verifyAuth(data);
  }

  @MessagePattern({ cmd: 'login' })
  login(@Payload() dto: any) {
    return this.authService.login(dto);
  }
}
```

### [auth.service.ts](file:///c:/Users/X1/pro/alikohub/alikohub/domains/core-platform-services/auth-service/src/auth/auth.service.ts)
Validate session cookie using Firebase Admin.

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';

@Injectable()
export class AuthService {
  async verifyAuth({ type, value }: { type: 'cookie' | 'token'; value: string }) {
    try {
      let decoded;
      if (type === 'cookie') {
        decoded = await firebaseAdmin.auth().verifySessionCookie(value, true);
      } else {
        decoded = await firebaseAdmin.auth().verifyIdToken(value);
      }
      
      // Fetch user from DB (Prisma)
      // const user = await prisma.user.findUnique({ where: { firebaseId: decoded.uid } });
      
      return { user: { uid: decoded.uid, email: decoded.email } }; // Return user object
    } catch (e) {
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
```

## 4. Implementation: API Gateway (The Consumer)

This server consumes the Auth Service.

### [app.module.ts](file:///c:/Users/X1/pro/alikohub/alikohub/domains/core-platform-services/auth-service/src/app.module.ts)
Register the TCP Client.

```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3001 },
      },
      {
        name: 'CONTECH_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3002 },
      },
    ]),
  ],
})
export class AppModule {}
```

### [firebase_auth.guard.ts](file:///c:/Users/X1/pro/alikohub/alikohub/domains/core-platform-services/api-gateway-service/common/guard/firebase_auth.guard.ts) (The Core Integration)
This guard intercepts requests, calls Auth Service, and sets `req.user`.

```typescript
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionCookie = request.cookies?.session; // Requires cookie-parser

    if (!sessionCookie) return false;

    try {
      // RPC Call to Auth Service
      const response = await firstValueFrom(
        this.authClient.send({ cmd: 'verify' }, { type: 'cookie', value: sessionCookie })
          .pipe(timeout(5000))
      );

      if (!response?.user) return false;

      // Attach user to request for downstream controllers
      request.user = response.user;
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
```

### `contech-proxy.controller.ts`
Example of proxying a request to a subdomain service while passing the authenticated user.

```typescript
import { Controller, Post, Body, UseGuards, Inject, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from './firebase_auth.guard';

@Controller('contech')
@UseGuards(AuthGuard)
export class ConTechController {
  constructor(@Inject('CONTECH_SERVICE') private client: ClientProxy) {}

  @Post('projects')
  createProject(@Request() req, @Body() dto: any) {
    // Forward the DTO AND the User to the microservice
    const payload = { dto, user: req.user };
    return this.client.send({ cmd: 'create_project' }, payload);
  }
}
```

## 5. Configuration (Env Vars)

Ensure ports match across services.

**Gateway .env**
```env
PORT=3006
AUTH_SERVICE_HOST=localhost
AUTH_SERVICE_PORT=3001
CONTECH_SERVICE_HOST=localhost
CONTECH_SERVICE_PORT=3002
```

**Auth Service .env**
```env
PORT=3001
FIREBASE_API_KEY=...
DATABASE_URL=...
```

## 6. Summary Checklist

1.  [ ] **Create Monorepo** with Gateway and Microservice apps.
2.  [ ] **Install Dependencies** (`@nestjs/microservices`, etc.).
3.  [ ] **Set up Auth Service (TCP)** with [verify](file:///c:/Users/X1/pro/alikohub/alikohub/domains/core-platform-services/auth-service/src/auth/auth.controller.ts#53-56) command.
4.  [ ] **Set up API Gateway (HTTP)** with `ClientsModule` registration.
5.  [ ] **Implement AuthGuard** in Gateway to bridge the two.
6.  [ ] **Implement Controllers** in Gateway to proxy requests + user context.
