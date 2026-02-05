import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, TrendingDown, Package, Zap } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();

  const featuredProducts = products?.slice(0, 4) || [];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container py-16 md:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  🎉 Lowest Prices Guaranteed
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Welcome to{' '}
                  <span className="text-primary">bajya's market</span>
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl">
                  Low prices every day on quality products you love. Shop smart, save more, and enjoy unbeatable value on everything you need.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate({ to: '/products' })}
                  className="gap-2 text-base"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Start Shopping
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate({ to: '/products' })}
                  className="gap-2 text-base"
                >
                  <TrendingDown className="h-5 w-5" />
                  View Deals
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/bajyas-market-hero.dim_1600x600.png"
                alt="bajya's market - Low prices every day"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-border/40 bg-muted/30 py-12">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-none bg-background/50 shadow-sm">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="rounded-lg bg-primary/10 p-3">
                  <TrendingDown className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Lowest Prices</h3>
                  <p className="text-sm text-muted-foreground">
                    Unbeatable prices on all products, every single day
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none bg-background/50 shadow-sm">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Quality Products</h3>
                  <p className="text-sm text-muted-foreground">
                    Carefully selected items that meet our high standards
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none bg-background/50 shadow-sm sm:col-span-2 lg:col-span-1">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Fast Service</h3>
                  <p className="text-sm text-muted-foreground">
                    Quick and reliable service you can count on
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
              <p className="mt-2 text-muted-foreground">
                Check out our most popular items at amazing prices
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/products' })}
              className="hidden sm:flex"
            >
              View All
            </Button>
          </div>
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="mb-4 aspect-square w-full rounded-lg" />
                    <Skeleton className="mb-2 h-5 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="mt-8 text-center sm:hidden">
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/products' })}
              className="w-full"
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">
            Ready to Save Big?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90">
            Browse our full catalog and discover incredible deals on products you need. Low prices, high quality – that's our promise.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate({ to: '/products' })}
            className="gap-2 text-base"
          >
            <ShoppingBag className="h-5 w-5" />
            Shop All Products
          </Button>
        </div>
      </section>
    </div>
  );
}
