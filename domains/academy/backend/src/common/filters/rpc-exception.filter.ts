import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  ExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';
import { Observable, throwError } from 'rxjs';

/**
 * Centralized exception filter for Academy Microservice.
 */
@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): Observable<any> {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    let details: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse() as any;
      if (typeof response === 'object') {
        message = Array.isArray(response.message) ? response.message[0] : response.message || exception.message;
        error = response.error || 'Http Error';
        details = response.details || null;
      } else {
        message = response;
        error = 'Http Error';
      }
    }
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          const target = (exception.meta?.target as string[])?.join(', ');
          message = `Unique constraint violation: ${target || 'field'} already exists.`;
          error = 'Conflict';
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'The requested record was not found.';
          error = 'Not Found';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = 'Database operation failed.';
          error = 'Database Error';
      }
    }
    else if (exception instanceof RpcException) {
      return throwError(() => exception.getError());
    }
    else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unhandled error: ${message}`, exception.stack);
    } 

    const errorResponse = {
      statusCode: status,
      message: message,
      error: error,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
    };

    if (status >= 500) {
      this.logger.error(`Fatal Error: ${JSON.stringify(errorResponse)}`);
    } else {
      this.logger.warn(`Handled Exception: ${message} (Status: ${status})`);
    }

    return throwError(() => new RpcException(errorResponse));
  }
}
