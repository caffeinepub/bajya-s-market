import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw, CheckCircle2, AlertCircle, Store } from 'lucide-react';
import { useShopifySync } from '@/hooks/useShopifySync';
import { testShopifyConnection } from '@/lib/shopifyStorefront';
import { toast } from 'sonner';

export default function AdminShopifySyncSection() {
  const [storeDomain, setStoreDomain] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState('');

  const shopifySyncMutation = useShopifySync();

  const handleTestConnection = async () => {
    if (!storeDomain.trim() || !accessToken.trim()) {
      toast.error('Please enter both store domain and access token');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');
    setConnectionError('');

    const result = await testShopifyConnection(storeDomain.trim(), accessToken.trim());

    setIsTestingConnection(false);

    if (result.success) {
      setConnectionStatus('success');
      toast.success('Connection successful! You can now sync products.');
    } else {
      setConnectionStatus('error');
      setConnectionError(result.error || 'Connection failed');
      toast.error('Connection failed. Please check your credentials.');
    }
  };

  const handleSync = async () => {
    if (!storeDomain.trim() || !accessToken.trim()) {
      toast.error('Please enter both store domain and access token');
      return;
    }

    try {
      const result = await shopifySyncMutation.mutateAsync({
        storeDomain: storeDomain.trim(),
        accessToken: accessToken.trim(),
      });

      toast.success(`Successfully synced ${result.count} products from Shopify!`);
      setConnectionStatus('idle');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed';
      toast.error(errorMessage);
    }
  };

  const isSyncing = shopifySyncMutation.isPending;
  const canSync = connectionStatus === 'success' && !isSyncing;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          Shopify Product Sync
        </CardTitle>
        <CardDescription>
          Import products from your Shopify store using the Storefront API
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Store Domain Input */}
        <div className="space-y-2">
          <Label htmlFor="storeDomain">
            Store Domain <span className="text-destructive">*</span>
          </Label>
          <Input
            id="storeDomain"
            value={storeDomain}
            onChange={(e) => setStoreDomain(e.target.value)}
            placeholder="your-store.myshopify.com"
            disabled={isSyncing || isTestingConnection}
          />
          <p className="text-xs text-muted-foreground">
            Enter your Shopify store domain (e.g., your-store.myshopify.com)
          </p>
        </div>

        {/* Access Token Input */}
        <div className="space-y-2">
          <Label htmlFor="accessToken">
            Storefront Access Token <span className="text-destructive">*</span>
          </Label>
          <Input
            id="accessToken"
            type="password"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder="Enter your Storefront API access token"
            disabled={isSyncing || isTestingConnection}
          />
          <p className="text-xs text-muted-foreground">
            Get this from your Shopify admin: Settings → Apps and sales channels → Develop apps
          </p>
        </div>

        {/* Connection Status */}
        {connectionStatus === 'success' && (
          <Alert className="border-green-600/20 bg-green-50 dark:bg-green-950/20">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Connection successful! You can now sync products.
            </AlertDescription>
          </Alert>
        )}

        {connectionStatus === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connection failed: {connectionError}
            </AlertDescription>
          </Alert>
        )}

        {/* Sync Success Message */}
        {shopifySyncMutation.isSuccess && (
          <Alert className="border-green-600/20 bg-green-50 dark:bg-green-950/20">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Products synced successfully! Check the products table below.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={handleTestConnection}
            disabled={isSyncing || isTestingConnection}
            variant="outline"
            className="gap-2"
          >
            {isTestingConnection && <Loader2 className="h-4 w-4 animate-spin" />}
            Test Connection
          </Button>

          <Button
            onClick={handleSync}
            disabled={!canSync}
            className="gap-2"
          >
            {isSyncing && <Loader2 className="h-4 w-4 animate-spin" />}
            <RefreshCw className="h-4 w-4" />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>

        {/* Help Text */}
        <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
          <h4 className="mb-2 text-sm font-semibold">How to get your Storefront Access Token:</h4>
          <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
            <li>Go to your Shopify admin panel</li>
            <li>Navigate to Settings → Apps and sales channels</li>
            <li>Click "Develop apps" and create a new app</li>
            <li>Configure Storefront API access and generate an access token</li>
            <li>Copy the token and paste it above</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
