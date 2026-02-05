export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[SW] Service Worker registered successfully:', registration.scope);
          
          // Check for updates periodically
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker is ready but waiting
                  console.log('[SW] New service worker available. Update ready.');
                  
                  // Dispatch custom event for UI to listen to
                  window.dispatchEvent(new CustomEvent('swUpdateReady', {
                    detail: { registration }
                  }));
                }
              });
            }
          });

          // Listen for controller change (after skip waiting)
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('[SW] New service worker activated.');
            
            // Dispatch event to hide update banner
            window.dispatchEvent(new CustomEvent('swControllerChange'));
          });
        })
        .catch((error) => {
          // Log error but don't throw - service worker is optional enhancement
          console.warn('[SW] Service Worker registration failed:', error);
        });
    });
  } else {
    console.log('[SW] Service Workers not supported in this browser');
  }
}
