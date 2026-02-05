import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ShoppingBag } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <span className="text-4xl">🔍</span>
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription>
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            onClick={() => navigate({ to: '/' })}
            className="w-full gap-2"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/products' })}
            className="w-full gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            Browse Products
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
