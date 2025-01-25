export class AppError extends Error {
  public statusCode: number;
  public errorCode?: string;

  constructor(message: string, statusCode = 500, errorCode?: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

export function handleError(error: unknown): {
  message: string;
  statusCode: number;
} {
  if (error instanceof AppError) {
    return { message: error.message, statusCode: error.statusCode };
  } else if (error instanceof Error) {
    return { message: "An unexpected error occurred", statusCode: 500 };
  } else {
    return { message: "An unknown error occurred", statusCode: 500 };
  }
}
