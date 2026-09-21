import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Occasion, ProductCategory, ScentFamily } from '../../models/product.model';

@Component({
  selector: 'app-product-filters',
  templateUrl: './product-filters.html',
  styleUrl: './product-filters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFilters {
  readonly selectedCategory = input<ProductCategory | 'all'>('all');
  readonly inStockOnly = input<boolean>(false);
  readonly minPrice = input<number | undefined>(undefined);
  readonly maxPrice = input<number | undefined>(undefined);
  readonly scentFamilies = input<readonly ScentFamily[]>([]);
  readonly occasions = input<readonly Occasion[]>([]);

  readonly categoryChange = output<ProductCategory | 'all'>();
  readonly inStockChange = output<boolean>();
  readonly minPriceChange = output<number | undefined>();
  readonly maxPriceChange = output<number | undefined>();
  readonly scentFamilyToggle = output<ScentFamily>();
  readonly occasionToggle = output<Occasion>();
  readonly resetFilters = output<void>();

  readonly categories: readonly { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'electronics', label: 'Pure Extractions' },
    { id: 'footwear', label: 'Private Reserve' },
    { id: 'apparel', label: 'Atelier Oils' },
    { id: 'accessories', label: 'Discovery Vault' },
  ];

  readonly scentFamilyList: readonly ScentFamily[] = ['Floral', 'Woody', 'Oriental', 'Fresh'];
  readonly occasionList: readonly Occasion[] = ['Personal Use', 'Wedding', 'Gift Sets', 'Birthday'];

  protected selectCategory(category: ProductCategory | 'all'): void {
    this.categoryChange.emit(category);
  }

  protected toggleInStock(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.inStockChange.emit(checked);
  }

  protected onMinPriceChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const parsed = value === '' ? undefined : Number(value);
    this.minPriceChange.emit(
      parsed !== undefined && Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined,
    );
  }

  protected onMaxPriceChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const parsed = value === '' ? undefined : Number(value);
    this.maxPriceChange.emit(
      parsed !== undefined && Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined,
    );
  }

  protected isScentSelected(scent: ScentFamily): boolean {
    return this.scents().includes(scent);
  }

  protected toggleScent(scent: ScentFamily): void {
    this.scentFamilyToggle.emit(scent);
  }

  private scents() {
    return this.scentFamilies();
  }

  protected isOccasionSelected(occasion: Occasion): boolean {
    return this.occasions().includes(occasion);
  }

  protected toggleOccasion(occasion: Occasion): void {
    this.occasionToggle.emit(occasion);
  }
}
