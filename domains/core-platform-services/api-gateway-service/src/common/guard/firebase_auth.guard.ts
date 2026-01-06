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
        firebaseId: string;
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

    // 1. Extract the session cookie or Bearer token
    const sessionCookie = request.cookies?.session;
    const authHeader = request.headers.authorization;
    
    let type: 'cookie' | 'jwt' = 'cookie';
    let value: string | null = sessionCookie;

    if (!sessionCookie && authHeader && authHeader.startsWith('Bearer ')) {
      type = 'jwt';
      value = authHeader.split(' ')[1];
    }

    if (!value) {
      throw new UnauthorizedException('No authentication provided (cookie or token)');
    }

    try {
      // 2. Delegate verification to the auth-service
      const authResponse = await firstValueFrom(
        this.authClient
          .send(
            { cmd: 'verify' },
            { type, value },
          )
          .pipe(
            timeout(5000), // Timeout after 5 seconds
            catchError(() => {
              // If the auth-service throws an error, catch it
              throw new UnauthorizedException('Session is invalid or expired');
            }),
          ),
      );
      
      if (!authResponse?.user) {
        throw new UnauthorizedException('Invalid session');
      }

      // 3. Attach the full user object (returned from auth-service) to the request
      request.user = authResponse.user;
      
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      throw new UnauthorizedException(errorMessage);
    }
  }
}
