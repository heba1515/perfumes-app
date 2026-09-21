import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products',
  },
  {
    path: 'products',
    loadChildren: () =>
      import('@features/products/products.routes').then((m) => m.PRODUCTS_ROUTES),
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('@features/cart/cart.routes').then((m) => m.CART_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
