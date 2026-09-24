import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach } from 'vitest';
import { ProductCard } from './product-card';
import { Product } from '../../models/product.model';

describe('ProductCard', () => {
  let fixture: ComponentFixture<ProductCard>;
  let component: ProductCard;

  const mockProduct: Product = {
    id: 'test-1',
    name: 'Test Product',
    description: 'A test product description',
    price: 99.99,
    category: 'floral',
    imageUrl: 'https://example.com/test.jpg',
    rating: 4.5,
    reviewCount: 10,
    inStock: true,
    scentFamily: 'Floral',
    occasion: 'Wedding',
    options: ['30 ml'],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create and render product details', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.product-title')?.textContent).toContain('Test Product');
    expect(compiled.querySelector('.price')?.textContent).toContain('$99.99');
  });

  it('should emit addToCart event when button is clicked', () => {
    let emitted: Product | undefined;
    component.addToCart.subscribe((p) => {
      emitted = p;
    });

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(emitted).toEqual(mockProduct);
  });
});
