import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { LogIn, Plus, ShieldAlert } from 'lucide-react';
import AdminProductsTable from '@/components/admin/AdminProductsTable';
import AdminProductDialog from '@/components/admin/AdminProductDialog';
import AdminShopifySyncSection from '@/components/admin/AdminShopifySyncSection';
import type { Product } from '@/backend';

export default function AdminPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { data: products, isLoading: productsLoading, error } = useProducts();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const isLoggingIn = loginStatus === 'logging-in';

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Access Required</CardTitle>
            <CardDescription>
              Please log in to access the product management panel
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button
              onClick={login}
              disabled={isLoggingIn}
              size="lg"
              className="w-full gap-2"
            >
              <LogIn className="h-4 w-4" />
              {isLoggingIn ? 'Logging in...' : 'Log In'}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              You need to be authenticated to manage products
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading while checking admin status
  if (isAdminLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="mb-8 h-12 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-8">
        <Card className="w-full max-w-md border-destructive/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <ShieldAlert className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to access the admin panel. Only administrators can manage products.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Product Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your product catalog
          </p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="gap-2"
          disabled={productsLoading}
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Shopify Sync Section */}
      <div className="mb-8">
        <AdminShopifySyncSection />
      </div>

      {/* Products Table */}
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load products. Please try again later.
          </AlertDescription>
        </Alert>
      ) : productsLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <AdminProductsTable
          products={products || []}
          onEdit={(product) => setEditingProduct(product)}
        />
      )}

      {/* Create Dialog */}
      <AdminProductDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        mode="create"
      />

      {/* Edit Dialog */}
      {editingProduct && (
        <AdminProductDialog
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
          mode="edit"
          product={editingProduct}
        />
      )}
    </div>
  );
}
