import { handleError } from "@/utils/errorHandler";

export function handleClientError(error: unknown): {
  statusCode: number;
  message: string;
} {
  const { statusCode, message } = handleError(error);

  return { statusCode, message };
}
