import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    let details: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || message;
        error = responseObj.error || error;
        details = responseObj.details || null;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      
      // Handle RPC/Microservice errors
      if ((exception as any).code) {
        const errorCode = (exception as any).code;
        if (errorCode === 'ECONNREFUSED') {
          message = 'Service unavailable. Please try again later.';
          status = HttpStatus.SERVICE_UNAVAILABLE;
          error = 'Service Unavailable';
        }
      }
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // Ensure status is a valid numeric HTTP code
    const numericStatus = Number.isInteger(status) ? status : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(numericStatus).json({
      statusCode: numericStatus,
      message,
      error,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
