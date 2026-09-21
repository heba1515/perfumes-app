import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '@core/seo';
import { CartStore } from '@features/cart';
import { Product } from '../../models/product.model';
import { ProductsApi } from '../../services/products-api';
import { formatPrice } from '../../utils/product.utils';

@Component({
  selector: 'app-product-details-page',
  imports: [RouterLink],
  templateUrl: './product-details-page.html',
  styleUrl: './product-details-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productsApi = inject(ProductsApi);
  private readonly cartStore = inject(CartStore);
  private readonly seo = inject(SeoService);

  readonly product = signal<Product | null>(null);
  readonly relatedProducts = signal<Product[]>([]);
  readonly loading = signal<boolean>(true);
  readonly selectedOption = signal<string | undefined>(undefined);
  readonly quantity = signal<number>(1);
  readonly selectedGalleryIndex = signal<number>(0);
  readonly giftWrapSelected = signal<boolean>(false);
  readonly addedNotification = signal<boolean>(false);

  readonly formattedPrice = computed(() => {
    const p = this.product();
    return p ? formatPrice(p.price) : '';
  });

  readonly scentFamily = computed(() => {
    const p = this.product();
    const text = (p?.description ?? '').toLowerCase();

    if (text.includes('woody')) return 'Woody';
    if (text.includes('floral')) return 'Floral';
    if (text.includes('fresh')) return 'Fresh';
    if (text.includes('oriental')) return 'Oriental';
    return 'Woody';
  });

  readonly occasion = computed(() => {
    const p = this.product();
    const name = (p?.name ?? '').toLowerCase();

    if (name.includes('noir') || name.includes('santal') || name.includes('atelier')) return 'Evening';
    if (name.includes('lune') || name.includes('rose')) return 'Daylight';
    if (name.includes('sol') || name.includes('fresh')) return 'Morning';
    return 'Evening';
  });

  readonly sizePrices = computed(() => {
    const p = this.product();
    if (!p) return ['30 ml', '50 ml', '100 ml'];
    return [
      formatPrice(Math.max(80, p.price * 0.65)),
      formatPrice(Math.max(110, p.price * 0.82)),
      formatPrice(p.price),
    ];
  });

  readonly galleryImages = computed(() => {
    const p = this.product();
    if (!p) return [];
    return [p.imageUrl, p.imageUrl, p.imageUrl];
  });

  readonly selectedGalleryImage = computed(() => {
    return this.galleryImages()[this.selectedGalleryIndex()] ?? this.product()?.imageUrl ?? '';
  });

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('productId');
    if (productId) {
      this.loadProduct(productId);
      this.loadRelatedProducts();
    } else {
      this.loading.set(false);
    }
  }

  loadProduct(id: string): void {
    this.loading.set(true);
    this.productsApi.getProductById(id).subscribe({
      next: (item) => {
        this.product.set(item);
        this.loading.set(false);
        if (item) {
          const options = item.options?.length ? item.options : ['30 ml', '50 ml', '100 ml'];
          this.selectedOption.set(options[0]);
          this.selectedGalleryIndex.set(0);
          this.setupSeo(item);
        }
      },
      error: () => {
        this.product.set(null);
        this.loading.set(false);
      },
    });
  }

  loadRelatedProducts(): void {
    this.productsApi.getProducts().subscribe({
      next: (items) => {
        this.relatedProducts.set(items.slice(0, 4));
      },
      error: () => {
        this.relatedProducts.set([]);
      },
    });
  }

  onSelectOption(option: string): void {
    this.selectedOption.set(option);
  }

  onSelectGalleryImage(index: number): void {
    this.selectedGalleryIndex.set(index);
  }

  onToggleGiftWrap(): void {
    this.giftWrapSelected.update((selected) => !selected);
  }

  onQuantityChange(qty: number): void {
    if (qty >= 1 && qty <= 99) {
      this.quantity.set(qty);
    }
  }

  onAddToCart(): void {
    const p = this.product();
    if (p && p.inStock) {
      this.cartStore.addItem(p, this.quantity(), this.selectedOption());
      this.addedNotification.set(true);
      setTimeout(() => this.addedNotification.set(false), 2500);
    }
  }

  formatRelatedPrice(value: number): string {
    return formatPrice(value);
  }

  addRelatedToCart(product: Product): void {
    if (product.inStock) {
      this.cartStore.addItem(product, 1, product.options?.[0]);
      this.addedNotification.set(true);
      setTimeout(() => this.addedNotification.set(false), 2500);
    }
  }

  private setupSeo(product: Product): void {
    this.seo.updateMetadata({
      title: product.name,
      description: product.description,
      path: `/products/${product.id}`,
      imageUrl: product.imageUrl,
      type: 'product',
    });

    this.seo.setStructuredData({
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.name,
      image: [product.imageUrl],
      description: product.description,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: product.price,
        availability: product.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    });
  }
}
