import { computed, inject, Injectable, signal } from '@angular/core';
import { StorageService } from '@core/storage';
import { CartItem } from '../models/cart.model';

const CART_STORAGE_KEY = 'storefront_cart';

@Injectable({
  providedIn: 'root',
})
export class CartStore {
  private readonly storage = inject(StorageService);

  readonly items = signal<CartItem[]>(this.loadInitialCart());

  readonly totalItems = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0),
  );

  readonly subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  readonly tax = computed(() => Math.round(this.subtotal() * 0.08 * 100) / 100);

  readonly total = computed(() => this.subtotal() + this.tax());

  addItem(
    product: { id: string; name: string; price: number; imageUrl?: string },
    quantity = 1,
    selectedOption?: string,
  ): void {
    const current = this.items();
    const existingIndex = current.findIndex(
      (item) => item.productId === product.id && item.selectedOption === selectedOption,
    );

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = current.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${selectedOption ?? 'default'}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity,
        selectedOption,
      };
      updated = [...current, newItem];
    }

    this.items.set(updated);
    this.persist(updated);
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    const updated = this.items().map((item) =>
      item.id === itemId ? { ...item, quantity } : item,
    );
    this.items.set(updated);
    this.persist(updated);
  }

  removeItem(itemId: string): void {
    const updated = this.items().filter((item) => item.id !== itemId);
    this.items.set(updated);
    this.persist(updated);
  }

  clearCart(): void {
    this.items.set([]);
    this.persist([]);
  }

  private loadInitialCart(): CartItem[] {
    const saved = this.storage.getItem(CART_STORAGE_KEY);
    if (!saved) {
      return [];
    }
    try {
      return JSON.parse(saved) as CartItem[];
    } catch {
      return [];
    }
  }

  private persist(items: CartItem[]): void {
    this.storage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }
}
