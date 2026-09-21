import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '@core/seo';
import { CartItemComponent } from '../../components/cart-item/cart-item';
import { CartSummaryComponent } from '../../components/cart-summary/cart-summary';
import { CartStore } from '../../state/cart-store';

@Component({
  selector: 'app-cart-page',
  imports: [RouterLink, CartItemComponent, CartSummaryComponent],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage implements OnInit {
  readonly cartStore = inject(CartStore);
  private readonly seo = inject(SeoService);

  readonly checkoutSuccess = signal<boolean>(false);

  ngOnInit(): void {
    this.seo.updateMetadata({
      title: 'Shopping Cart',
      description: 'Review and manage items in your cart before checkout.',
      path: '/cart',
    });
  }

  onQuantityChange(event: { id: string; quantity: number }): void {
    this.cartStore.updateQuantity(event.id, event.quantity);
  }

  onRemoveItem(id: string): void {
    this.cartStore.removeItem(id);
  }

  onClearCart(): void {
    this.cartStore.clearCart();
  }

  onCheckout(): void {
    this.checkoutSuccess.set(true);
    this.cartStore.clearCart();
  }
}
