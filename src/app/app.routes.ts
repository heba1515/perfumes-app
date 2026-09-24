import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@features/home/pages/home-page/home-page').then((m) => m.HomePage),
  },
  {
    path: 'home',
    loadComponent: () => import('@features/home/pages/home-page/home-page').then((m) => m.HomePage),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('@features/categories/pages/categories-page/categories-page').then((m) => m.CategoriesPage),
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
    redirectTo: '',
  },
];
