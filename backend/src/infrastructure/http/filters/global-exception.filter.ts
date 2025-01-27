import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let errorCode = "INTERNAL_SERVER_ERROR";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
        errorCode = exceptionResponse;
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null
      ) {
        message =
          (exceptionResponse as { message?: string }).message || message;
        errorCode =
          (exceptionResponse as { error?: string }).error || errorCode;
      }
    } else {
      const exceptionMessage =
        typeof exception === "object" && exception !== null
          ? JSON.stringify(exception)
          : String(exception);

      this.logger.error(`Unhandled exception: ${exceptionMessage}`);
    }

    const errorResponse = {
      status: "error",
      errorCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(
      `[${request.method}] ${request.url} >> Status: ${status}, Message: ${message}`,
    );

    response.status(status).json(errorResponse);
  }
}
