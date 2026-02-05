import { Heart } from 'lucide-react';

export default function StoreFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-semibold">bajya's market</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted destination for quality products at unbeatable prices. We believe everyone deserves access to great products without breaking the bank.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/" className="transition-colors hover:text-foreground">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="transition-colors hover:text-foreground">
                  Products
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold">Our Promise</h3>
            <p className="text-sm text-muted-foreground">
              Low prices every day. Quality products. Fast service. Your satisfaction is our priority.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © 2026. Built with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground transition-colors hover:text-primary"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
