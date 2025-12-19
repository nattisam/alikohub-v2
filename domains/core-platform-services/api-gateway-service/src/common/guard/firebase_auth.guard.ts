import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom, timeout, catchError } from 'rxjs';

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
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // 1. Extract the session cookie instead of the Bearer token
    const sessionCookie = request.cookies?.session;

    if (!sessionCookie) {
      throw new UnauthorizedException('Session cookie not provided');
    }

    try {
      // 2. Delegate verification to the auth-service
      //    This sends a message and waits for the response.
      const authResponse = await firstValueFrom(
        this.authClient
          .send(
            { cmd: 'verify' }, // The message pattern in your auth-service
            { type: 'cookie', value: sessionCookie }, // The payload
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