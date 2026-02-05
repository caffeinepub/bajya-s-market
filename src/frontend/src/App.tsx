import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AdminPage from './pages/AdminPage';
import StoreLayout from './components/StoreLayout';
import { registerServiceWorker } from './pwa/registerServiceWorker';

const rootRoute = createRootRoute({
  component: StoreLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductsPage,
});

const productDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$id',
  component: ProductDetailsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([indexRoute, productsRoute, productDetailsRoute, adminRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return <RouterProvider router={router} />;
}
