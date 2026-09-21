import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartPage } from './cart-page';
import { CartStore } from '../../state/cart-store';

describe('CartPage', () => {
  let fixture: ComponentFixture<CartPage>;
  let component: CartPage;
  let cartStore: CartStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CartPage);
    component = fixture.componentInstance;
    cartStore = TestBed.inject(CartStore);
    cartStore.clearCart();
    fixture.detectChanges();
  });

  it('should render empty state when cart has no items', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.cart-title')?.textContent).toContain('Shopping Cart');
    expect(compiled.querySelector('.empty-cart-state')?.textContent).toContain(
      'Your cart is currently empty',
    );
  });

  it('should display items and summary when cart has items', () => {
    cartStore.addItem({ id: 'p1', name: 'Item 1', price: 50 }, 1);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-cart-state')).toBeNull();
    expect(compiled.querySelector('app-cart-item')).toBeTruthy();
    expect(compiled.querySelector('app-cart-summary')).toBeTruthy();
  });
});
