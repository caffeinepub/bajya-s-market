import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Product } from '@/backend';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const imageUrl = product.imageUrl || '/assets/generated/product-placeholder.dim_800x800.png';

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0">
        <div
          className="relative aspect-square cursor-pointer overflow-hidden bg-muted/30"
          onClick={() => navigate({ to: '/products/$id', params: { id: product.id.toString() } })}
        >
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/assets/generated/product-placeholder.dim_800x800.png';
            }}
          />
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge variant="destructive" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3
              className="line-clamp-2 cursor-pointer font-semibold transition-colors hover:text-primary"
              onClick={() => navigate({ to: '/products/$id', params: { id: product.id.toString() } })}
            >
              {product.name}
            </h3>
          </div>
          <Badge variant="secondary" className="mb-3 text-xs">
            {product.category}
          </Badge>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">
                {product.currency} {product.price.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">Lowest price</div>
            </div>
            <Button
              size="sm"
              onClick={() => navigate({ to: '/products/$id', params: { id: product.id.toString() } })}
            >
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
