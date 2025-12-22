import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('RpcExceptionFilter');

  catch(exception: RpcException, host: ArgumentsHost): Observable<any> | void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const error = exception.getError();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (typeof error === 'object' && error !== null) {
      const errorObj = error as any;
      status = errorObj.statusCode || errorObj.status || HttpStatus.INTERNAL_SERVER_ERROR;
      message = errorObj.message || message;
    } else if (typeof error === 'string') {
      message = error;
    }

    this.logger.error(`RPC Error: ${message}`, exception.stack);

    if (response && typeof response.status === 'function') {
      response.status(status).json({
        statusCode: status,
        message,
        error: 'RPC Error',
        timestamp: new Date().toISOString(),
        path: request?.url,
      });
    } else {
      return throwError(() => exception);
    }
  }
}
