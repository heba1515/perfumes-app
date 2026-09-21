import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartItemComponent } from './cart-item';
import { CartItem } from '../../models/cart.model';

describe('CartItemComponent', () => {
  let fixture: ComponentFixture<CartItemComponent>;
  let component: CartItemComponent;

  const mockItem: CartItem = {
    id: 'prod-1-opt',
    productId: 'prod-1',
    name: 'Wireless Headphones',
    price: 150,
    quantity: 2,
    selectedOption: 'Black',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItemComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CartItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', mockItem);
    fixture.detectChanges();
  });

  it('should render item information and line total', () => {
    expect(component).toBeTruthy();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.item-name')?.textContent).toContain('Wireless Headphones');
    expect(el.querySelector('.line-total')?.textContent).toContain('$300.00');
    expect(el.querySelector('.qty-count')?.textContent).toContain('2');
  });

  it('should emit itemRemove when remove is clicked', () => {
    let removedId: string | undefined;
    component.itemRemove.subscribe((id) => {
      removedId = id;
    });

    const removeBtn = fixture.nativeElement.querySelector('.remove-btn') as HTMLButtonElement;
    removeBtn.click();

    expect(removedId).toBe('prod-1-opt');
  });
});
