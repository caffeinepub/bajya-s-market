/**
 * Shopify Storefront API client for fetching products
 */

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  productType: string;
  variants: {
    edges: Array<{
      node: {
        id: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
      };
    }>;
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText?: string;
      };
    }>;
  };
}

export interface ShopifyProductsResponse {
  data?: {
    products: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
  };
  errors?: Array<{
    message: string;
  }>;
}

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          productType
          variants(first: 1) {
            edges {
              node {
                id
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Build Shopify Storefront GraphQL endpoint URL from store domain
 */
export function buildStorefrontUrl(storeDomain: string): string {
  // Remove protocol if present
  const cleanDomain = storeDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return `https://${cleanDomain}/api/2024-01/graphql.json`;
}

/**
 * Test connection to Shopify Storefront API
 */
export async function testShopifyConnection(
  storeDomain: string,
  accessToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = buildStorefrontUrl(storeDomain);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken,
      },
      body: JSON.stringify({
        query: `{ shop { name } }`,
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();

    if (data.errors && data.errors.length > 0) {
      return {
        success: false,
        error: data.errors[0].message,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Fetch products from Shopify Storefront API
 */
export async function fetchShopifyProducts(
  storeDomain: string,
  accessToken: string,
  limit: number = 50
): Promise<{ products: ShopifyProduct[]; error?: string }> {
  try {
    const url = buildStorefrontUrl(storeDomain);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken,
      },
      body: JSON.stringify({
        query: PRODUCTS_QUERY,
        variables: { first: limit },
      }),
    });

    if (!response.ok) {
      return {
        products: [],
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data: ShopifyProductsResponse = await response.json();

    if (data.errors && data.errors.length > 0) {
      return {
        products: [],
        error: data.errors[0].message,
      };
    }

    if (!data.data?.products?.edges) {
      return {
        products: [],
        error: 'Invalid response format from Shopify',
      };
    }

    const products = data.data.products.edges.map((edge) => edge.node);
    return { products };
  } catch (error) {
    return {
      products: [],
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}
