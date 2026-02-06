import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

/**
 * Hook to check if the current caller is an admin
 */
export function useIsAdmin() {
  const { actor, isFetching: isActorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isActorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: query.isLoading || isActorFetching || !actor,
  };
}
