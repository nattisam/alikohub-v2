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

    if (exception instanceof RpcException) {
      const rpcError = exception.getError();
      if (typeof rpcError === 'object' && rpcError !== null) {
        statusCode = (rpcError as any).statusCode || (rpcError as any).status || HttpStatus.BAD_REQUEST;
        message = (rpcError as any).message || 'RPC Error';
        error = (rpcError as any).error || 'RPC Error';
      } else {
        statusCode = HttpStatus.BAD_REQUEST;
        message = typeof rpcError === 'string' ? rpcError : 'RPC Error';
      }
    }
    else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;
      const resp = exception.getResponse() as any;
      if (typeof resp === 'object') {
        const msg = resp.message;
        message = Array.isArray(msg) ? msg[0] : msg || message;
        error = resp.error || error;
        details = resp.details || null;
      }
    }
    else if (exception && typeof exception === 'object') {
      // Handle serialized exceptions from microservices
      // They often have { response: { message, statusCode }, status }
      const rawStatus = exception.statusCode || exception.status || exception.response?.statusCode || exception.response?.status;
      
      if (typeof rawStatus === 'number' && !isNaN(rawStatus)) {
        statusCode = rawStatus;
      } else if (typeof rawStatus === 'string' && !isNaN(Number(rawStatus))) {
        statusCode = Number(rawStatus);
      }
      
      message = exception.message || (Array.isArray(exception.response?.message) ? exception.response.message[0] : exception.response?.message) || message;
      error = exception.error || exception.response?.error || (statusCode === 500 ? 'Internal Server Error' : 'RPC Error');
      details = exception.details || exception.response?.details || null;
    }
    else if (exception instanceof Error) {
      message = exception.message;
      // Handle connection errors
      if ((exception as any).code === 'ECONNREFUSED') {
        message = 'Service unavailable. Please try again later.';
        statusCode = HttpStatus.SERVICE_UNAVAILABLE;
        error = 'Service Unavailable';
      }
    }

    // Final sanity check on statusCode
    if (typeof statusCode !== 'number' || isNaN(statusCode) || statusCode < 100 || statusCode > 599) {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    this.logger.error(`${request.method} ${request.url} - ${statusCode} - ${message}`);
    if (statusCode === 500) {
      this.logger.error(exception);
    }

    if (response && typeof response.status === 'function') {
      response.status(statusCode).json({
        statusCode,
        message,
        error,
        ...(details && { details }),
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
