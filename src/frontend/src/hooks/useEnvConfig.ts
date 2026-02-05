import { useQuery } from '@tanstack/react-query';
import { loadConfig } from '../config';
import { ConfigurationError } from '../lib/errors';

export interface EnvConfigState {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isConfigured: boolean;
}

/**
 * Hook to load and validate runtime environment configuration
 * Returns a stable UI state for app-wide rendering decisions
 */
export function useEnvConfig(): EnvConfigState {
  const query = useQuery({
    queryKey: ['envConfig'],
    queryFn: async () => {
      try {
        const config = await loadConfig();
        return { success: true, config };
      } catch (error) {
        if (error instanceof ConfigurationError) {
          throw error;
        }
        throw new Error('Failed to load configuration');
      }
    },
    retry: false,
    staleTime: Infinity,
  });

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    isConfigured: query.isSuccess,
  };
}
