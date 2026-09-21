import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/products-page/products-page').then((m) => m.ProductsPage),
  },
  {
    path: ':productId',
    loadComponent: () =>
      import('./pages/product-details-page/product-details-page').then(
        (m) => m.ProductDetailsPage,
      ),
  },
];
