import { Injectable, signal } from '@angular/core';
import { Occasion, ProductCategory, ProductFilterCriteria, ProductSortOption, ScentFamily } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductFiltersStore {
  readonly searchTerm = signal<string>('');
  readonly selectedCategory = signal<ProductCategory | 'all'>('all');
  readonly selectedSort = signal<ProductSortOption>('featured');
  readonly inStockOnly = signal<boolean>(false);
  readonly minPrice = signal<number | undefined>(undefined);
  readonly maxPrice = signal<number | undefined>(undefined);
  readonly scentFamilies = signal<readonly ScentFamily[]>([]);
  readonly occasions = signal<readonly Occasion[]>([]);

  setSearch(term: string): void {
    this.searchTerm.set(term);
  }

  setCategory(category: ProductCategory | 'all'): void {
    this.selectedCategory.set(category);
  }

  setSort(sort: ProductSortOption): void {
    this.selectedSort.set(sort);
  }

  setInStockOnly(inStock: boolean): void {
    this.inStockOnly.set(inStock);
  }

  setMinPrice(price: number | undefined): void {
    this.minPrice.set(price);
  }

  setMaxPrice(price: number | undefined): void {
    this.maxPrice.set(price);
  }

  toggleScentFamily(scent: ScentFamily): void {
    const current = this.scentFamilies();
    const next = current.includes(scent)
      ? current.filter((s) => s !== scent)
      : [...current, scent];
    this.scentFamilies.set(next);
  }

  setScents(next: readonly ScentFamily[]): void {
    this.scentFamilies.set(next);
  }

  toggleOccasion(occasion: Occasion): void {
    const current = this.occasions();
    const next = current.includes(occasion)
      ? current.filter((o) => o !== occasion)
      : [...current, occasion];
    this.occasions.set(next);
  }

  setOccasions(next: readonly Occasion[]): void {
    this.occasions.set(next);
  }

  getCriteria(): ProductFilterCriteria {
    return {
      search: this.searchTerm(),
      category: this.selectedCategory(),
      inStockOnly: this.inStockOnly(),
      minPrice: this.minPrice(),
      maxPrice: this.maxPrice(),
      scentFamilies: this.scentFamilies(),
      occasions: this.occasions(),
    };
  }

  reset(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('all');
    this.selectedSort.set('featured');
    this.inStockOnly.set(false);
    this.minPrice.set(undefined);
    this.maxPrice.set(undefined);
    this.scentFamilies.set([]);
    this.occasions.set([]);
  }
}
