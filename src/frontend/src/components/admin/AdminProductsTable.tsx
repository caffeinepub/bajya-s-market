import { useState } from 'react';
import { useDeleteProduct, useToggleProductStock } from '@/hooks/useProducts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/backend';

interface AdminProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

export default function AdminProductsTable({ products, onEdit }: AdminProductsTableProps) {
  const [deleteProductId, setDeleteProductId] = useState<bigint | null>(null);
  const deleteProductMutation = useDeleteProduct();
  const toggleStockMutation = useToggleProductStock();

  const handleDelete = async () => {
    if (!deleteProductId) return;

    try {
      await deleteProductMutation.mutateAsync(deleteProductId);
      toast.success('Product deleted successfully');
      setDeleteProductId(null);
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleToggleStock = async (id: bigint, currentStock: boolean) => {
    try {
      await toggleStockMutation.mutateAsync({ id, inStock: !currentStock });
      toast.success(`Product marked as ${!currentStock ? 'in stock' : 'out of stock'}`);
    } catch (error) {
      toast.error('Failed to update stock status');
    }
  };

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
          <Package className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No products yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Get started by adding your first product
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id.toString()}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl || '/assets/generated/product-placeholder.dim_800x800.png'}
                          alt={product.name}
                          className="h-12 w-12 rounded-md object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/assets/generated/product-placeholder.dim_800x800.png';
                          }}
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">
                        {product.currency} {product.price.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={product.inStock ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleToggleStock(product.id, product.inStock)}
                        disabled={toggleStockMutation.isPending}
                        className="gap-1.5"
                      >
                        <Package className="h-3.5 w-3.5" />
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteProductId(product.id)}
                          disabled={deleteProductMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProductId} onOpenChange={(open) => !open && setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
