import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * The cart is user-specific and has no SEO value, so it renders on the client.
 */
export const CART_SERVER_ROUTES: ServerRoute[] = [
  { path: 'cart', renderMode: RenderMode.Client },
];
