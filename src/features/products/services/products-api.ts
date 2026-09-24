import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '@core/config';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  Product,
  ProductCategory,
  ProductFilterCriteria,
  ProductSortOption,
} from '../models/product.model';
import { filterProducts, sortProducts } from '../utils/product.utils';

/**
 * Mock data catalog for immediate local development and SSR validation.
 * Clearly separated from production API endpoint integration.
 */
const MOCK_PRODUCTS: readonly Product[] = [
  {
    id: 'prod-001',
    name: 'Fleur de Lune',
    description: 'Floral / Jasmine & White Musk',
    price: 195,
    category: 'electronics',
    imageUrl: 'assets/products/fleur-de-lune.png',
    rating: 4.8,
    reviewCount: 142,
    inStock: true,
    scentFamily: 'Floral',
    occasion: 'Wedding',
    options: ['30 ml', '50 ml'],
  },
  {
    id: 'prod-002',
    name: 'Santal Parchment',
    description: 'Woody / Sandalwood & Cardamom',
    price: 220,
    category: 'footwear',
    imageUrl: 'assets/products/santal-parchment.png',
    rating: 4.7,
    reviewCount: 98,
    inStock: true,
    scentFamily: 'Woody',
    occasion: 'Personal Use',
    options: ['30 ml', '50 ml'],
  },
  {
    id: 'prod-003',
    name: 'Noir Cocoon',
    description: 'Oriental / Tobacco & Amber',
    price: 240,
    category: 'accessories',
    imageUrl: 'assets/products/noir-cocoon.png',
    rating: 4.9,
    reviewCount: 64,
    inStock: true,
    scentFamily: 'Oriental',
    occasion: 'Gift Sets',
    options: ['30 ml', '50 ml'],
  },
  {
    id: 'prod-004',
    name: "Sol d'Or",
    description: 'Fresh / Bergamot & Sea Salt',
    price: 185,
    category: 'apparel',
    imageUrl: 'assets/products/sol-dor.png',
    rating: 4.6,
    reviewCount: 53,
    inStock: false,
    scentFamily: 'Fresh',
    occasion: 'Birthday',
    options: ['30 ml', '50 ml'],
  },
  {
    id: 'prod-005',
    name: 'Atelier Oud',
    description: 'Woody / Rich Oud & Saffron',
    price: 310,
    category: 'electronics',
    imageUrl: 'assets/products/atelier-oud.png',
    rating: 4.9,
    reviewCount: 210,
    inStock: true,
    scentFamily: 'Woody',
    occasion: 'Gift Sets',
    options: ['30 ml', '50 ml'],
  },
  {
    id: 'prod-006',
    name: 'Rose Absolute',
    description: 'Floral / Damask Rose & Cedar',
    price: 205,
    category: 'accessories',
    imageUrl: 'assets/products/rose-absolute.png',
    rating: 4.5,
    reviewCount: 39,
    inStock: true,
    scentFamily: 'Floral',
    occasion: 'Wedding',
    options: ['30 ml', '50 ml'],
  },
];

@Injectable({
  providedIn: 'root',
})
export class ProductsApi {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG, { optional: true });

  private get baseUrl(): string {
    return this.config?.apiBaseUrl ?? 'http://localhost:4200/api';
  }

  getProducts(
    filters?: ProductFilterCriteria,
    sort: ProductSortOption = 'featured',
  ): Observable<Product[]> {
    // When real API endpoint is configured, HttpClient is queried. Falls back to mock data gracefully.
    return this.http.get<Product[]>(`${this.baseUrl}/products`).pipe(
      map((products) => {
        let result = products;
        if (filters) {
          result = filterProducts(result, filters);
        }
        return sortProducts(result, sort);
      }),
      catchError(() => {
        let result = [...MOCK_PRODUCTS];
        if (filters) {
          result = filterProducts(result, filters);
        }
        return of(sortProducts(result, sort));
      }),
    );
  }

  getProductById(id: string): Observable<Product | null> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`).pipe(
      catchError(() => {
        const found = MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
        return of(found);
      }),
    );
  }

  getCategories(): Observable<ProductCategory[]> {
    return of(['electronics', 'footwear', 'apparel', 'accessories']);
  }
}
