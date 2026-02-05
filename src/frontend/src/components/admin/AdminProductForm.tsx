import { useState, useEffect } from 'react';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { imageToDataUrl } from '@/utils/imageToDataUrl';
import type { Product } from '@/backend';

interface AdminProductFormProps {
  mode: 'create' | 'edit';
  product?: Product;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  currency: string;
  category: string;
  imageUrl: string;
  inStock: boolean;
}

const CATEGORIES = ['Home', 'Office', 'Electronics', 'Fitness', 'Kitchen', 'Fashion', 'Other'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR'];

export default function AdminProductForm({ mode, product, onSuccess }: AdminProductFormProps) {
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const [formData, setFormData] = useState<FormData>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price.toString() || '',
    currency: product?.currency || 'USD',
    category: product?.category || 'Other',
    imageUrl: product?.imageUrl || '',
    inStock: product?.inStock ?? true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product?.imageUrl || '');
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imageFile]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else {
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.price = 'Price must be a positive number';
      }
    }

    if (!formData.currency) {
      newErrors.currency = 'Currency is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({ ...formData, imageUrl: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      let finalImageUrl = formData.imageUrl;

      // Convert local file to Data URL if selected
      if (imageFile) {
        finalImageUrl = await imageToDataUrl(imageFile);
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        currency: formData.currency,
        category: formData.category,
        imageUrl: finalImageUrl,
        inStock: formData.inStock,
      };

      if (mode === 'create') {
        await createProductMutation.mutateAsync(productData);
        toast.success('Product created successfully');
      } else if (product) {
        await updateProductMutation.mutateAsync({
          ...productData,
          id: product.id,
        });
        toast.success('Product updated successfully');
      }

      onSuccess();
    } catch (error) {
      toast.error(mode === 'create' ? 'Failed to create product' : 'Failed to update product');
    }
  };

  const isPending = createProductMutation.isPending || updateProductMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Product Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter product name"
          disabled={isPending}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter product description"
          rows={3}
          disabled={isPending}
        />
      </div>

      {/* Price and Currency */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">
            Price <span className="text-destructive">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
            disabled={isPending}
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">
            Currency <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => setFormData({ ...formData, currency: value })}
            disabled={isPending}
          >
            <SelectTrigger id="currency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.currency && (
            <p className="text-sm text-destructive">{errors.currency}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
          disabled={isPending}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Product Image</Label>
        <div className="space-y-3">
          {/* Image URL Input */}
          <Input
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="Enter image URL or upload a file below"
            disabled={isPending || !!imageFile}
          />

          {/* File Upload */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('image-file-input')?.click()}
              disabled={isPending}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Image
            </Button>
            <input
              id="image-file-input"
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />
            {imageFile && (
              <span className="text-sm text-muted-foreground">
                {imageFile.name}
              </span>
            )}
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 rounded-lg border object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/assets/generated/product-placeholder.dim_800x800.png';
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                onClick={handleRemoveImage}
                disabled={isPending}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* In Stock Toggle */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="inStock">In Stock</Label>
          <p className="text-sm text-muted-foreground">
            Mark this product as available for purchase
          </p>
        </div>
        <Switch
          id="inStock"
          checked={formData.inStock}
          onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
          disabled={isPending}
        />
      </div>

      {/* Error Alert */}
      {(createProductMutation.isError || updateProductMutation.isError) && (
        <Alert variant="destructive">
          <AlertDescription>
            {mode === 'create'
              ? 'Failed to create product. Please try again.'
              : 'Failed to update product. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="gap-2"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === 'create' ? 'Create Product' : 'Update Product'}
        </Button>
      </div>
    </form>
  );
}
