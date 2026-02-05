import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';

export default function PwaUpdateBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    const handleUpdateReady = (event: Event) => {
      const customEvent = event as CustomEvent<{ registration: ServiceWorkerRegistration }>;
      setRegistration(customEvent.detail.registration);
      setShowBanner(true);
    };

    const handleControllerChange = () => {
      // Hide banner after update is applied
      setShowBanner(false);
    };

    window.addEventListener('swUpdateReady', handleUpdateReady);
    window.addEventListener('swControllerChange', handleControllerChange);

    return () => {
      window.removeEventListener('swUpdateReady', handleUpdateReady);
      window.removeEventListener('swControllerChange', handleControllerChange);
    };
  }, []);

  const handleRefresh = () => {
    if (registration && registration.waiting) {
      // Tell the waiting service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page after a short delay to allow activation
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-background/95 px-4 py-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <RefreshCw className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">Update Available</p>
            <p className="text-xs text-muted-foreground">A new version of the app is ready</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
