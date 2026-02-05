import { Outlet } from '@tanstack/react-router';
import StoreHeader from './StoreHeader';
import StoreFooter from './StoreFooter';

export default function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <StoreFooter />
    </div>
  );
}
