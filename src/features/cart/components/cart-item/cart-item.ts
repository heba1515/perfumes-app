import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatPrice } from '@features/products/utils/product.utils';
import { CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart-item',
  imports: [RouterLink],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent {
  readonly item = input.required<CartItem>();

  readonly quantityChange = output<{ id: string; quantity: number }>();
  readonly itemRemove = output<string>();

  protected readonly unitPrice = computed(() => formatPrice(this.item().price));
  protected readonly lineTotal = computed(
    () => formatPrice(this.item().price * this.item().quantity),
  );

  protected onQuantityChange(delta: number): void {
    const next = this.item().quantity + delta;
    this.quantityChange.emit({ id: this.item().id, quantity: next });
  }

  protected onRemove(): void {
    this.itemRemove.emit(this.item().id);
  }
}
