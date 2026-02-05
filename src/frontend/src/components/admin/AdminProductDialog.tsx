import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AdminProductForm from './AdminProductForm';
import type { Product } from '@/backend';

interface AdminProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  product?: Product;
}

export default function AdminProductDialog({
  open,
  onOpenChange,
  mode,
  product,
}: AdminProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New Product' : 'Edit Product'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Fill in the details to add a new product to your catalog'
              : 'Update the product information below'}
          </DialogDescription>
        </DialogHeader>
        <AdminProductForm
          mode={mode}
          product={product}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
