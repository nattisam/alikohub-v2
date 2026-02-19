import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  ExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Prisma } from '../../generated/client';
import { Observable, throwError } from 'rxjs';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): Observable<any> {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    let details: any = null;

    // 1. Check for HttpException (duck typing + constructor check + name check)
    if (exception && (
      exception instanceof HttpException || 
      (typeof exception.getStatus === 'function' && typeof exception.getResponse === 'function') ||
      exception.constructor?.name === 'ForbiddenException' ||
      exception.constructor?.name === 'NotFoundException' ||
      exception.constructor?.name === 'BadRequestException' ||
      (exception as any).name === 'ForbiddenException' || 
      (exception as any).name === 'NotFoundException' ||
      (exception as any).message?.includes('permission') // desperate fallback for 403
    )) {
      status = typeof exception.getStatus === 'function' ? exception.getStatus() : 
               ((exception.constructor?.name === 'ForbiddenException' || (exception as any).name === 'ForbiddenException' || (exception as any).message?.includes('permission')) ? 403 : 
               ((exception.constructor?.name === 'NotFoundException' || (exception as any).name === 'NotFoundException') ? 404 : 400));
               
      const response = typeof exception.getResponse === 'function' ? exception.getResponse() : exception.message;
      if (typeof response === 'object') {
        message = Array.isArray(response.message) ? response.message[0] : response.message || exception.message;
        error = response.error || 'Http Error';
        details = response.details || null;
      } else {
        message = response;
        error = 'Http Error';
      }
    }
    // 2. Check for objects with explicit status properties
    else if (exception && (exception.statusCode || exception.status) && typeof (exception.statusCode || exception.status) === 'number') {
        const rawStatus = exception.statusCode || exception.status;
        if (rawStatus >= 100 && rawStatus <= 599) {
            status = rawStatus;
            message = exception.message || 'Error';
            error = 'Error';
        }
    }
    // 3. Prisma Known Errors
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      this.logger.error(`Prisma Known Error: ${exception.code} - ${exception.message}`);
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
          message = `Database operation failed: ${exception.code}`;
          error = 'Database Error';
      }
    }
    // 4. Prisma Validation Errors
    else if (exception instanceof Prisma.PrismaClientValidationError) {
      this.logger.error(`Prisma Validation Error: ${exception.message}`);
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid data provided for database operation.';
      error = 'Validation Error';
      details = exception.message;
    }
    // 5. Prisma Initialization Errors
    else if (exception instanceof Prisma.PrismaClientInitializationError) {
      this.logger.error(`Prisma Initialization Error: ${exception.message}`);
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'Database connection failed.';
      error = 'Initialization Error';
    }
    // 6. RpcException (pass through)
    else if (exception instanceof RpcException) {
      return throwError(() => exception.getError());
    }
    // 7. Generic Error
    else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unhandled error: ${message}`, exception.stack);
    } 
    // 8. Catch-all
    else {
      console.error('[CRITICAL] Academy Microservice hit a non-Error exception:', exception);
      if (exception?.constructor) console.error('Constructor:', exception.constructor.name);
      console.dir(exception, { depth: null });
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
