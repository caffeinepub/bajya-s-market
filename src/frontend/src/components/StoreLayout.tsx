import { Outlet } from '@tanstack/react-router';
import StoreHeader from './StoreHeader';
import StoreFooter from './StoreFooter';
import PwaUpdateBanner from './PwaUpdateBanner';
import ConfigErrorState from './ConfigErrorState';
import { useEnvConfig } from '../hooks/useEnvConfig';
import { Loader2 } from 'lucide-react';

export default function StoreLayout() {
  const { isLoading, isError, error, isConfigured } = useEnvConfig();

  // Show loading state while checking configuration
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading configuration...</p>
        </div>
      </div>
    );
  }

  // Show error state if configuration is invalid
  if (isError && error) {
    return <ConfigErrorState error={error} />;
  }

  // Render normal layout if configuration is valid
  if (isConfigured) {
    return (
      <div className="flex min-h-screen flex-col">
        <StoreHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <StoreFooter />
        <PwaUpdateBanner />
      </div>
    );
  }

  // Fallback (should not reach here)
  return null;
}
