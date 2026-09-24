import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SeoService } from '@core/seo';
import { CartStore } from '@features/cart';
import { ProductFilters } from '../../components/product-filters/product-filters';
import { ProductGrid } from '../../components/product-grid/product-grid';
import { ProductSearch } from '../../components/product-search/product-search';
import { ProductSort } from '../../components/product-sort/product-sort';
import {
  Occasion,
  Product,
  ProductCategory,
  ProductSortOption,
  ScentFamily,
} from '../../models/product.model';
import { ProductFiltersStore } from '../../services/product-filters-store';
import { ProductsApi } from '../../services/products-api';

@Component({
  selector: 'app-products-page',
  imports: [RouterLink, ProductSearch, ProductFilters, ProductSort, ProductGrid],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPage implements OnInit {
  private readonly productsApi = inject(ProductsApi);
  private readonly cartStore = inject(CartStore);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly filterStore = inject(ProductFiltersStore);

  readonly products = signal<Product[]>([]);
  readonly loading = signal<boolean>(true);

  ngOnInit(): void {
    this.seo.updateMetadata({
      title: 'All Fragrances',
      description:
        'Shop our curated collection of extrait de parfum formulations — floral, woody, oriental, and fresh fragrances for every occasion.',
      path: '/products',
    });

    this.route.queryParamMap.subscribe((params) => {
      const search = params.get('q') ?? '';
      const category = (params.get('category') as ProductCategory | 'all') ?? 'all';
      const sort = (params.get('sort') as ProductSortOption) ?? 'featured';
      const minPriceRaw = params.get('minPrice');
      const maxPriceRaw = params.get('maxPrice');
      const minPrice = minPriceRaw !== null ? Number(minPriceRaw) : undefined;
      const maxPrice = maxPriceRaw !== null ? Number(maxPriceRaw) : undefined;
      const scentFamilies = params.getAll('scentFamilies').filter(Boolean) as ScentFamily[];
      const occasions = params.getAll('occasions').filter(Boolean) as Occasion[];

      this.filterStore.setSearch(search);
      this.filterStore.setCategory(category);
      this.filterStore.setSort(sort);
      this.filterStore.setMinPrice(
        minPrice !== undefined && Number.isFinite(minPrice) && minPrice >= 0 ? minPrice : undefined,
      );
      this.filterStore.setMaxPrice(
        maxPrice !== undefined && Number.isFinite(maxPrice) && maxPrice >= 0 ? maxPrice : undefined,
      );
      this.filterStore.setScents(scentFamilies);
      this.filterStore.setOccasions(occasions);

      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productsApi
      .getProducts(
        this.filterStore.getCriteria(),
        this.filterStore.selectedSort(),
      )
      .subscribe({
        next: (items) => {
          this.products.set(items);
          this.loading.set(false);
        },
        error: () => {
          this.products.set([]);
          this.loading.set(false);
        },
      });
  }

  onSearch(query: string): void {
    this.filterStore.setSearch(query);
    this.syncQueryParams();
    this.loadProducts();
  }

  onCategoryChange(category: ProductCategory | 'all'): void {
    this.filterStore.setCategory(category);
    this.syncQueryParams();
    this.loadProducts();
  }

  onSortChange(sort: ProductSortOption): void {
    this.filterStore.setSort(sort);
    this.syncQueryParams();
    this.loadProducts();
  }

  onInStockChange(inStock: boolean): void {
    this.filterStore.setInStockOnly(inStock);
    this.loadProducts();
  }

  onMinPriceChange(price: number | undefined): void {
    this.filterStore.setMinPrice(price);
    this.syncQueryParams();
    this.loadProducts();
  }

  onMaxPriceChange(price: number | undefined): void {
    this.filterStore.setMaxPrice(price);
    this.syncQueryParams();
    this.loadProducts();
  }

  onScentFamilyToggle(scent: ScentFamily): void {
    this.filterStore.toggleScentFamily(scent);
    this.syncQueryParams();
    this.loadProducts();
  }

  onOccasionToggle(occasion: Occasion): void {
    this.filterStore.toggleOccasion(occasion);
    this.syncQueryParams();
    this.loadProducts();
  }

  onResetFilters(): void {
    this.filterStore.reset();
    this.syncQueryParams();
    this.loadProducts();
  }

  onAddToCart(product: Product): void {
    this.cartStore.addItem(product);
  }

  private syncQueryParams(): void {
    const q = this.filterStore.searchTerm() || null;
    const category =
      this.filterStore.selectedCategory() === 'all'
        ? null
        : this.filterStore.selectedCategory();
    const sort =
      this.filterStore.selectedSort() === 'featured'
        ? null
        : this.filterStore.selectedSort();
    const minPrice = this.filterStore.minPrice() ?? null;
    const maxPrice = this.filterStore.maxPrice() ?? null;
    const scentFamilies = this.filterStore.scentFamilies();
    const occasions = this.filterStore.occasions();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q,
        category,
        sort,
        minPrice,
        maxPrice,
        scentFamilies: scentFamilies.length > 0 ? scentFamilies : null,
        occasions: occasions.length > 0 ? occasions : null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
