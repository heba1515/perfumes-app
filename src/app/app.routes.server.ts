import { RenderMode, ServerRoute } from '@angular/ssr';
import { CART_SERVER_ROUTES } from '@features/cart/cart.routes.server';
import { PRODUCTS_SERVER_ROUTES } from '@features/products/products.routes.server';

export const serverRoutes: ServerRoute[] = [
  ...PRODUCTS_SERVER_ROUTES,
  ...CART_SERVER_ROUTES,
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
