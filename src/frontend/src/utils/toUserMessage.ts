/**
 * Converts unknown error values into user-friendly English messages
 * @param error - The error value to convert
 * @returns A user-friendly error message string
 */
export function toUserMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }

  return 'An unexpected error occurred. Please try again.';
}
