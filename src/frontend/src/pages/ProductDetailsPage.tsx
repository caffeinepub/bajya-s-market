import { useParams, useNavigate } from '@tanstack/react-router';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Package, Tag } from 'lucide-react';

export default function ProductDetailsPage() {
  const { id } = useParams({ from: '/products/$id' });
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useProducts();

  const product = products?.find((p) => p.id.toString() === id);

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="mb-6 h-10 w-32" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load product details. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Product Not Found</h1>
        <p className="mb-6 text-muted-foreground">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate({ to: '/products' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>
    );
  }

  const imageUrl = product.imageUrl || '/assets/generated/product-placeholder.dim_800x800.png';

  return (
    <div className="container py-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/products' })}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-muted/30">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/assets/generated/product-placeholder.dim_800x800.png';
            }}
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
                {product.name}
              </h1>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {product.category}
                </Badge>
                {product.inStock ? (
                  <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
                    <Package className="h-3 w-3" />
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <Package className="h-3 w-3" />
                    Out of Stock
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-1 text-sm text-muted-foreground">Price</div>
            <div className="text-4xl font-bold text-primary">
              {product.currency} {product.price.toFixed(2)}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Lowest price guaranteed
            </p>
          </div>

          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <h3 className="mb-2 font-semibold">Description</h3>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </CardContent>
          </Card>

          <div className="mt-auto space-y-3">
            <Button
              size="lg"
              className="w-full text-base"
              disabled={!product.inStock}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Free shipping on orders over $50
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mb-2 text-2xl">🚚</div>
            <h3 className="mb-1 font-semibold">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">
              Quick and reliable shipping
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mb-2 text-2xl">💯</div>
            <h3 className="mb-1 font-semibold">Quality Guaranteed</h3>
            <p className="text-sm text-muted-foreground">
              100% satisfaction promise
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mb-2 text-2xl">💰</div>
            <h3 className="mb-1 font-semibold">Best Price</h3>
            <p className="text-sm text-muted-foreground">
              Lowest prices every day
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
