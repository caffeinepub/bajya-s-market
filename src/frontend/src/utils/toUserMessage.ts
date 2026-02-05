import { ConfigurationError } from '../lib/errors';

/**
 * Convert unknown error values to user-friendly messages
 */
export function toUserMessage(error: unknown): string {
  if (error instanceof ConfigurationError) {
    return error.message;
  }

  if (error instanceof Error) {
    // Check for common backend error patterns
    if (error.message.includes('Unauthorized')) {
      return 'You do not have permission to perform this action.';
    }
    if (error.message.includes('does not exist')) {
      return 'The requested item could not be found.';
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (error.message.includes('canister') || error.message.includes('actor')) {
      return 'Unable to connect to the backend service. Please try again later.';
    }
    
    // Return the error message if it's already user-friendly
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred. Please try again.';
}
