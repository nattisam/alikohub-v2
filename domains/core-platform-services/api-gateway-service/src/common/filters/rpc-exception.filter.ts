import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';


@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    let details: any = null;

    // 1. Handle explicit RpcException
    if (exception instanceof RpcException) {
      const rpcError = exception.getError();
      if (typeof rpcError === 'object' && rpcError !== null) {
        // Safely extract status code - ensure it's a valid number
        const rawStatus = (rpcError as any).statusCode || (rpcError as any).status;
        if (typeof rawStatus === 'number' && rawStatus >= 100 && rawStatus <= 599) {
          statusCode = rawStatus;
        } else {
          statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        message = (rpcError as any).message || 'RPC Error';
        error = (rpcError as any).error || 'RPC Error';
        details = (rpcError as any).details || null;
      } else {
        statusCode = HttpStatus.BAD_REQUEST;
        message = typeof rpcError === 'string' ? rpcError : 'RPC Error';
      }
    }
    // 2. Handle standard Nest HttpException
    else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const resp = exception.getResponse() as any;
      if (typeof resp === 'object') {
        message = Array.isArray(resp.message) ? resp.message[0] : resp.message || exception.message;
        error = resp.error || 'Identity Error';
        details = resp.details || null;
      } else {
        message = resp;
      }
    }
    // 3. Handle serialized errors from microservices (passed as generic objects)
    else if (exception && typeof exception === 'object') {
      // Microservices often return { message, statusCode, error } or { response: { message, statusCode } }
      const rawStatus = exception.statusCode || exception.status || exception.response?.statusCode || exception.response?.status;
      
      if (typeof rawStatus === 'number' && !isNaN(rawStatus) && rawStatus >= 100 && rawStatus <= 599) {
        statusCode = rawStatus;
      }
      
      const rawMessage = exception.message || exception.response?.message;
      message = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage || message;
      error = exception.error || exception.response?.error || (statusCode === 500 ? 'Internal Server Error' : 'Microservice Error');
      details = exception.details || exception.response?.details || null;
      
      // Handle connection errors
      if (exception.code === 'ECONNREFUSED') {
         statusCode = HttpStatus.SERVICE_UNAVAILABLE;
         message = 'A downstream service is currently unavailable. Please try again later.';
         error = 'Service Unavailable';
      }
    }
    // 4. Handle generic Error objects
    else if (exception instanceof Error) {
      message = exception.message;
      if ((exception as any).code === 'ECONNREFUSED') {
        statusCode = HttpStatus.SERVICE_UNAVAILABLE;
        message = 'Service connection failed.';
        error = 'Service Unavailable';
      }
    }

    // Logging
    const logMessage = `${request.method} ${request.url} - ${statusCode} - ${message}`;
    if (statusCode >= 500) {
      this.logger.error(logMessage);
      if (exception.stack) {
        this.logger.error(exception.stack);
      } else {
        // Log the whole exception object if there's no stack trace
        console.error('[CRITICAL] Internal Error without stack trace:', exception);
        console.dir(exception, { depth: null });
      }
      
      // Security: Do not leak internal error messages for 500 errors to the client in production
      if (process.env.NODE_ENV === 'production') {
        message = 'An unexpected error occurred on our server. Our team has been notified.';
      }
    } else {
      this.logger.warn(logMessage);
    }

    const isProduction = process.env.NODE_ENV === 'production';

    // Final response to client
    if (response && typeof response.status === 'function') {
      response.status(statusCode).json({
        statusCode,
        message,
        error,
        // Only provide details if not in production or if it's a non-sensitive validation error
        ...(!isProduction || error === 'Bad Request' ? { details } : {}),
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
