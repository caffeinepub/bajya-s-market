import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Show install button if prompt is available
  if (deferredPrompt && showPrompt) {
    return (
      <div className="relative">
        <Button
          onClick={handleInstallClick}
          variant="outline"
          size="sm"
          className="gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Install App</span>
        </Button>
        <button
          onClick={handleDismiss}
          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted-foreground hover:text-background"
          aria-label="Dismiss"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  // Show fallback instructions if prompt not available but not installed
  if (!isInstalled && !deferredPrompt) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Install App</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Download className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-semibold text-sm">Install bajya's market</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Add this app to your home screen for quick access
                </p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">On Android Chrome:</p>
              <ol className="list-decimal list-inside space-y-1 pl-2">
                <li>Tap the menu (⋮) in the top right</li>
                <li>Select "Add to Home screen"</li>
                <li>Tap "Add" to confirm</li>
              </ol>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return null;
}
