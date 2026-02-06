import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { fetchShopifyProducts, type ShopifyProduct } from '@/lib/shopifyStorefront';
import type { ProductInput } from '@/backend';

/**
 * Map Shopify product to ProductInput for backend
 */
function mapShopifyProductToInput(shopifyProduct: ShopifyProduct): ProductInput {
  // Get first variant (price, currency, availability)
  const firstVariant = shopifyProduct.variants.edges[0]?.node;
  const price = firstVariant ? parseFloat(firstVariant.price.amount) : 0;
  const currency = firstVariant?.price.currencyCode || 'USD';
  const inStock = firstVariant?.availableForSale ?? true;

  // Get first image URL
  const firstImage = shopifyProduct.images.edges[0]?.node;
  const imageUrl = firstImage?.url || '';

  // Use productType as category, fallback to 'Other'
  const category = shopifyProduct.productType || 'Other';

  // Extract Shopify product ID (remove gid://shopify/Product/ prefix if present)
  const externalId = shopifyProduct.id.replace('gid://shopify/Product/', '');

  return {
    name: shopifyProduct.title,
    description: shopifyProduct.description || '',
    price,
    currency,
    category,
    imageUrl,
    inStock,
    externalId,
    externalSource: { __kind__: 'shopify', shopify: null },
  };
}

export interface ShopifySyncParams {
  storeDomain: string;
  accessToken: string;
}

/**
 * Hook to sync products from Shopify Storefront API
 */
export function useShopifySync() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ storeDomain, accessToken }: ShopifySyncParams) => {
      if (!actor) throw new Error('Actor not initialized');

      // Fetch products from Shopify
      const { products, error } = await fetchShopifyProducts(storeDomain, accessToken);

      if (error) {
        throw new Error(`Shopify API error: ${error}`);
      }

      if (products.length === 0) {
        throw new Error('No products found in your Shopify store');
      }

      // Map Shopify products to ProductInput
      const productInputs: ProductInput[] = products.map(mapShopifyProductToInput);

      // Send to backend for bulk upsert
      await actor.bulkUpsertShopifyProducts(productInputs);

      return { count: products.length };
    },
    onSuccess: () => {
      // Invalidate products query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
