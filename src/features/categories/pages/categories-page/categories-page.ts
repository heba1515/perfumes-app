import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { SeoService } from '@core/seo';
import { SanityContentService, toCategoryFilter } from '@core/sanity';
import {
  Occasion,
  ProductCategory,
  ScentFamily,
} from '@features/products/models/product.model';

interface CategoryCard {
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  filterKey: {
    category?: ProductCategory | 'all';
    scentFamilies?: readonly ScentFamily[];
    occasions?: readonly Occasion[];
  };
}

@Component({
  selector: 'app-categories-page',
  imports: [RouterLink],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPage implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly content = inject(SanityContentService);

  readonly categories = signal<CategoryCard[]>([
    {
      title: 'Floral',
      subtitle: 'Jasmine, rose, and soft musk',
      image: '/assets/categories/floral.png',
      badge: 'Signature',
      filterKey: {
        category: 'all',
        scentFamilies: ['Floral'],
      },
    },
    {
      title: 'Woody',
      subtitle: 'Sandalwood, cedar, and amber',
      image: '/assets/categories/woody.png',
      badge: 'Warm',
      filterKey: {
        category: 'all',
        scentFamilies: ['Woody'],
      },
    },
    {
      title: 'Oriental',
      subtitle: 'Spice, leather, and resin',
      image: '/assets/categories/oriental.png',
      badge: 'Opulent',
      filterKey: {
        category: 'all',
        scentFamilies: ['Oriental'],
      },
    },
    {
      title: 'Fresh',
      subtitle: 'Citrus, air, and sea notes',
      image: '/assets/categories/fresh.png',
      badge: 'Crisp',
      filterKey: {
        category: 'all',
        scentFamilies: ['Fresh'],
      },
    },
    {
      title: 'Gifts & Occasions',
      subtitle: 'Curated sets for moments worth remembering',
      image: '/assets/categories/gifts & occasions.png',
      badge: 'Gifted',
      filterKey: {
        category: 'Discovery Sets',
        occasions: ['Gift Sets'],
      },
    },
    {
      title: 'Private Reserve',
      subtitle: 'Limited compositions and collector blends',
      image: '/assets/categories/private reserve.jpg',
      badge: 'Rare',
      filterKey: {
        category: 'Private Reserve',
      },
    },
    {
      title: 'Discovery Sets',
      subtitle: 'Explore the collection through a curated sampler',
      image: '/assets/categories/discovery sets.jpg',
      badge: 'New',
      filterKey: {
        category: 'Discovery Sets',
      },
    },
  ]);

  ngOnInit(): void {
    this.seo.updateMetadata({
      title: 'Categories',
      description: 'Discover fragrance categories from floral and woody to fresh and private reserve.',
      path: '/categories',
    });

    this.content
      .getCategories('categories')
      .pipe(take(1))
      .subscribe((categories) => {
        if (categories.length > 0) {
          this.categories.set(
            categories.map((category) => ({
              title: category.title,
              subtitle: category.subtitle,
              image: category.imageUrl,
              badge: category.badge,
              filterKey: toCategoryFilter(category),
            })),
          );
        }
      });
  }
}
