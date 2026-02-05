import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Menu, Shield } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import PwaInstallPrompt from './PwaInstallPrompt';

export default function StoreHeader() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <img
            src="/assets/generated/bajyas-market-logo.dim_512x512.png"
            alt="bajya's market logo"
            className="h-10 w-10 rounded-lg"
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold leading-none text-primary">bajya's market</span>
            <span className="text-xs text-muted-foreground">Low prices every day</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-4 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              activeProps={{ className: 'text-primary font-semibold' }}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to="/admin"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              activeProps={{ className: 'text-primary font-semibold' }}
            >
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" />
                Admin
              </span>
            </Link>
          )}
          <PwaInstallPrompt />
          <Button
            onClick={() => navigate({ to: '/products' })}
            size="sm"
            className="gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            Shop Now
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <PwaInstallPrompt />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-4 pt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="text-base font-medium text-foreground/80 transition-colors hover:text-foreground"
                    activeProps={{ className: 'text-primary font-semibold' }}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="text-base font-medium text-foreground/80 transition-colors hover:text-foreground"
                    activeProps={{ className: 'text-primary font-semibold' }}
                  >
                    <span className="flex items-center gap-1.5">
                      <Shield className="h-4 w-4" />
                      Admin
                    </span>
                  </Link>
                )}
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    navigate({ to: '/products' });
                  }}
                  className="mt-4 gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Shop Now
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
