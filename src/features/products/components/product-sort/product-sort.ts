import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ProductSortOption } from '../../models/product.model';

@Component({
  selector: 'app-product-sort',
  templateUrl: './product-sort.html',
  styleUrl: './product-sort.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSort {
  readonly selectedSort = input<ProductSortOption>('featured');
  readonly totalCount = input<number>(0);

  readonly sortChange = output<ProductSortOption>();

  protected onChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as ProductSortOption;
    this.sortChange.emit(value);
  }
}
