import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { formatPrice } from '../../utils/product.utils';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly addToCart = output<Product>();

  protected readonly formattedPrice = computed(() => formatPrice(this.product().price));

  protected onAddToCart(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.product().inStock) {
      this.addToCart.emit(this.product());
    }
  }
}
