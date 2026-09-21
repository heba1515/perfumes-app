import { RenderMode, ServerRoute } from '@angular/ssr';

export const PRODUCTS_SERVER_ROUTES: ServerRoute[] = [
  { path: 'products', renderMode: RenderMode.Server },
  { path: 'products/:productId', renderMode: RenderMode.Server },
];
