import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom, timeout, catchError } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

// Extend the Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        firebaseId: string;
        email: string;
        globalRole: string;
      };
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  // Inject the client proxy to communicate with the auth-service
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    // 1. Extract the session cookie and/or Bearer token
    const sessionCookie = request.cookies?.session;
    const authHeader = request.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    // Prefer Bearer token (more reliable for cross-origin), fall back to cookie
    const authMethods: Array<{ type: 'cookie' | 'jwt'; value: string }> = [];
    if (bearerToken) {
      authMethods.push({ type: 'jwt', value: bearerToken });
    }
    if (sessionCookie) {
      authMethods.push({ type: 'cookie', value: sessionCookie });
    }

    if (authMethods.length === 0) {
      throw new UnauthorizedException('No authentication provided (cookie or token)');
    }

    // Try each auth method in order
    for (const auth of authMethods) {
      try {
        const authResponse = await firstValueFrom(
          this.authClient
            .send(
              { cmd: 'verify' },
              { type: auth.type, value: auth.value },
            )
            .pipe(
              timeout(5000),
              catchError(() => {
                throw new UnauthorizedException('Session is invalid or expired');
              }),
            ),
        );
        
        if (authResponse?.user) {
          // Attach the full user object to the request
          request.user = authResponse.user;
          return true;
        }
      } catch {
        // Try next auth method
        continue;
      }
    }

    throw new UnauthorizedException('Authentication failed - all methods exhausted');
  }
}