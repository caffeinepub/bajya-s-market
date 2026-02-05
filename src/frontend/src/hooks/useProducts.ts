import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toUserMessage } from '@/utils/toUserMessage';
import type { Product } from '@/backend';

export function useProducts() {
  const { actor, isFetching: isActorFetching } = useActor();

  const query = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getAllProducts();
    },
    enabled: !!actor && !isActorFetching,
  });

  return {
    ...query,
    // Treat actor initialization as part of loading state
    isLoading: query.isLoading || isActorFetching || !actor,
  };
}

export function useSeedProducts() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.seedSampleProducts();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productInput: {
      name: string;
      description: string;
      price: number;
      currency: string;
      category: string;
      imageUrl: string;
      inStock: boolean;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addProduct(productInput);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      throw new Error(toUserMessage(error));
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.updateProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      throw new Error(toUserMessage(error));
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      throw new Error(toUserMessage(error));
    },
  });
}

export function useToggleProductStock() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, inStock }: { id: bigint; inStock: boolean }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.toggleProductStock(id, inStock);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      throw new Error(toUserMessage(error));
    },
  });
}
