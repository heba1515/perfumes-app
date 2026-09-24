import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SeoService } from '@core/seo';
import { CartItemComponent } from '../../components/cart-item/cart-item';
import { CartSummaryComponent } from '../../components/cart-summary/cart-summary';
import { CartStore } from '../../state/cart-store';
import { ProductCard } from '@features/products/components/product-card/product-card';
import { Product } from '@features/products/models/product.model';
import { ProductsApi } from '@features/products/services/products-api';

@Component({
  selector: 'app-cart-page',
  imports: [RouterLink, CartItemComponent, CartSummaryComponent, ProductCard],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage implements OnInit {
  readonly cartStore = inject(CartStore);
  private readonly seo = inject(SeoService);
  private readonly productsApi = inject(ProductsApi);
  private readonly router = inject(Router);
  readonly recommendedProducts = signal<Product[]>([]);

  ngOnInit(): void {
    this.seo.updateMetadata({
      title: 'Shopping Cart',
      description: 'Review and manage items in your cart before checkout.',
      path: '/cart',
    });

    this.productsApi.getProducts().subscribe((products) => {
      this.recommendedProducts.set(products.slice(0, 4));
    });
  }

  onAddRecommendedProduct(product: Product): void {
    this.cartStore.addItem(product);
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
    void this.router.navigateByUrl('/cart/checkout');
  }
}
