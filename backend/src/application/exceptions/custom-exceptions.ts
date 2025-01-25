import { HttpException, HttpStatus } from "@nestjs/common";

export class BadRequestException extends HttpException {
  constructor(message = "Bad Request", errorCode = "BAD_REQUEST") {
    super({ message, error: errorCode }, HttpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = "Unauthorized", errorCode = "UNAUTHORIZED") {
    super({ message, error: errorCode }, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = "Forbidden", errorCode = "FORBIDDEN") {
    super({ message, error: errorCode }, HttpStatus.FORBIDDEN);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = "Not Found", errorCode = "NOT_FOUND") {
    super({ message, error: errorCode }, HttpStatus.NOT_FOUND);
  }
}

export class MethodNotAllowedException extends HttpException {
  constructor(
    message = "Method Not Allowed",
    errorCode = "METHOD_NOT_ALLOWED",
  ) {
    super({ message, error: errorCode }, HttpStatus.METHOD_NOT_ALLOWED);
  }
}

export class ConflictException extends HttpException {
  constructor(message = "Conflict", errorCode = "CONFLICT") {
    super({ message, error: errorCode }, HttpStatus.CONFLICT);
  }
}

export class UnprocessableEntityException extends HttpException {
  constructor(
    message = "Unprocessable Entity",
    errorCode = "UNPROCESSABLE_ENTITY",
  ) {
    super({ message, error: errorCode }, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class TooManyRequestsException extends HttpException {
  constructor(message = "Too Many Requests", errorCode = "TOO_MANY_REQUESTS") {
    super({ message, error: errorCode }, HttpStatus.TOO_MANY_REQUESTS);
  }
}

export class InternalServerException extends HttpException {
  constructor(
    message = "Internal Server Error",
    errorCode = "INTERNAL_SERVER_ERROR",
  ) {
    super({ message, error: errorCode }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class NotImplementedException extends HttpException {
  constructor(message = "Not Implemented", errorCode = "NOT_IMPLEMENTED") {
    super({ message, error: errorCode }, HttpStatus.NOT_IMPLEMENTED);
  }
}

export class ServiceUnavailableException extends HttpException {
  constructor(
    message = "Service Unavailable",
    errorCode = "SERVICE_UNAVAILABLE",
  ) {
    super({ message, error: errorCode }, HttpStatus.SERVICE_UNAVAILABLE);
  }
}
