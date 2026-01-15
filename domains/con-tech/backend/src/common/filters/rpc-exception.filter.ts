import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class RpcExceptionFilter {
  private readonly logger = new Logger(RpcExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): Observable<any> {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    // Handle HttpException (like ForbiddenException)
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      status = exception.getStatus();

      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object' && response !== null) {
        message = (response as any).message || message;
        error = (response as any).error || error;
      }
    }
    // Handle RpcException
    else if (exception instanceof RpcException) {
      return throwError(() => exception.getError());
    }
    // Handle other errors
    else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unhandled error: ${message}`, exception.stack);
    } else {
      this.logger.error('Unknown error type:', exception);
    }

    // Format the error response
    const errorResponse = {
      statusCode: status,
      message: message,
      error: error,
    };

    // Return as RpcException with the error response
    return throwError(() => new RpcException(errorResponse));
  }
}
