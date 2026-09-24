import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { formatPrice } from '@features/products/utils/product.utils';
import { Button } from '@shared/ui/button/button';

@Component({
  selector: 'app-cart-summary',
  imports: [Button],
  templateUrl: './cart-summary.html',
  styleUrl: './cart-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummaryComponent {
  readonly subtotal = input.required<number>();
  readonly total = input.required<number>();
  readonly totalItems = input.required<number>();

  readonly checkout = output<void>();

  protected readonly formattedSubtotal = computed(() => formatPrice(this.subtotal()));
  protected readonly formattedTotal = computed(() => formatPrice(this.total()));
}
