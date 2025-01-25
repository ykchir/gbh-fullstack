import axios from "axios";

export class AppError extends Error {
  public statusCode: number;
  public errorCode?: string;

  constructor(message: string, statusCode = 500, errorCode?: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export function handleError(error: unknown): {
  message: string;
  statusCode: number;
} {
  if (error instanceof AppError) {
    return { message: error.message, statusCode: error.statusCode };
  } else if (axios.isAxiosError(error)) {
    if (error.response) {
      return {
        message:
          error.response.data?.message || "Server responded with an error",
        statusCode: error.response.status,
      };
    } else if (error.request) {
      return {
        message: "Network error. No response received from the server.",
        statusCode: 503,
      };
    } else {
      return {
        message: error.message || "An Axios error occurred",
        statusCode: 500,
      };
    }
  } else if (error instanceof Error) {
    return { message: error.message, statusCode: 500 };
  } else if (typeof error === "string") {
    return { message: error, statusCode: 500 };
  } else {
    return { message: "An unknown error occurred", statusCode: 500 };
  }
}
