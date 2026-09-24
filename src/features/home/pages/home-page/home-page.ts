import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { SeoService } from '@core/seo';
import { SanityContentService, toCategoryFilter } from '@core/sanity';
import { SanitySiteProduct } from '@core/sanity';
import { CartStore } from '@features/cart';
import { ProductGrid } from '@features/products/components/product-grid/product-grid';
import { Product } from '@features/products/models/product.model';
import { ProductsApi } from '@features/products/services/products-api';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, ProductGrid, CurrencyPipe],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly content = inject(SanityContentService);
  private readonly productsApi = inject(ProductsApi);
  private readonly cartStore = inject(CartStore);

  readonly featuredProducts = signal<Product[]>([]);
  readonly hero = signal({
    eyebrow: 'New arrival',
    title: 'Fragrance designed to linger in memory.',
    description: 'Curated perfumes and intimate scent rituals for evenings that deserve a signature.',
    primaryLabel: 'Shop bestsellers',
    secondaryLabel: 'Explore the collection',
  });
  readonly metrics = signal([
    { value: '12k+', label: 'orders shipped' },
    { value: '4.9/5', label: 'average rating' },
    { value: '6', label: 'signature blends' },
  ]);
  readonly heroProduct = signal<SanitySiteProduct>({
    id: 'fallback-hero',
    name: 'Fleur de Lune',
    price: 195,
    imageUrl: 'assets/products/fleur-de-lune.png',
    description: 'Floral / Jasmine & White Musk',
  });
  readonly story = signal({
    eyebrow: 'The atelier',
    title: 'Crafted for slow mornings, warm evenings, and unforgettable entrances.',
    description:
      'We build each composition around a precise emotional note — luminous florals, deep woods, and resinous warmth designed to evolve beautifully on skin.',
    imageUrl: 'assets/products/rose-absolute.png',
  });
  readonly storyProduct = signal<SanitySiteProduct>({
    id: 'fallback-story',
    name: 'Rose Absolute',
    price: 205,
    imageUrl: 'assets/products/rose-absolute.png',
    description: 'Damask rose & cedar',
  });

  readonly categories = signal<readonly {
    name: string;
    image: string;
    description: string;
    filterKey: ReturnType<typeof toCategoryFilter>;
  }[]>([
    {
      name: 'Floral',
      image: 'assets/categories/floral.png',
      description: 'Jasmine & White Musk',
      filterKey: { category: 'all', scentFamilies: ['Floral'] },
    },
    {
      name: 'Woody',
      image: 'assets/categories/woody.png',
      description: 'Sandalwood & Cardamom',
      filterKey: { category: 'all', scentFamilies: ['Woody'] },
    },
    {
      name: 'Oriental',
      image: 'assets/categories/oriental.png',
      description: 'Tobacco & Amber',
      filterKey: { category: 'all', scentFamilies: ['Oriental'] },
    },
    {
      name: 'Fresh',
      image: 'assets/categories/fresh.png',
      description: 'Bergamot & Sea Salt',
      filterKey: { category: 'all', scentFamilies: ['Fresh'] },
    },
  ]);

  readonly promises = signal([
    'Small-batch perfumery',
    'Natural-origin ingredients',
    'Complimentary gift wrapping',
  ]);

  ngOnInit(): void {
    this.seo.updateMetadata({
      title: 'Odoratus | Luxury Fragrance House',
      description:
        'Explore the Odoratus fragrance house — refined perfumes for every moment, from daily rituals to unforgettable occasions.',
      path: '/',
    });

    this.productsApi.getProducts(undefined, 'featured').subscribe({
      next: (products) => this.featuredProducts.set(products.slice(0, 3)),
      error: () => this.featuredProducts.set([]),
    });

    this.content
      .getCategories('home')
      .pipe(take(1))
      .subscribe((categories) => {
        if (categories.length > 0) {
          this.categories.set(
            categories.map((category) => ({
              name: category.title,
              image: category.imageUrl,
              description: category.subtitle,
              filterKey: toCategoryFilter(category),
            })),
          );
        }
      });

    this.content
      .getSiteSettings()
      .pipe(take(1))
      .subscribe((settings) => {
        if (!settings) {
          return;
        }

        this.hero.set(settings.hero);
        this.metrics.set([...settings.metrics]);
        this.story.set(settings.story);
        this.promises.set([...settings.story.promises]);
        if (settings.hero.featuredProduct) {
          this.heroProduct.set(settings.hero.featuredProduct);
        }
        if (settings.story.featuredProduct) {
          this.storyProduct.set(settings.story.featuredProduct);
        }
      });
  }

  onAddToCart(product: Product): void {
    this.cartStore.addItem(product);
  }
}
