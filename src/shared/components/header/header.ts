import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { APP_CONFIG } from '@core/config';
import { CartStore } from '@features/cart';
import { ProductSearch } from '@features/products/components/product-search/product-search';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, ProductSearch],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly config = inject(APP_CONFIG, { optional: true });
  private readonly router = inject(Router);
  readonly cartStore = inject(CartStore);
  readonly searchTerm = signal('');

  readonly appName = this.config?.appName ?? 'Storefront';

  onSearch(query: string): void {
    this.searchTerm.set(query);
    void this.router.navigate(['/products'], {
      queryParams: { q: query || null },
    });
  }
}
