import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-grid',
  imports: [ProductCard],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductGrid {
  readonly products = input.required<Product[]>();
  readonly addToCart = output<Product>();
}
