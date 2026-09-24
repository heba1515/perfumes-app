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
    { id: 'Pure Extractions', label: 'Pure Extractions' },
    { id: 'Private Reserve', label: 'Private Reserve' },
    { id: 'Atelier Oils', label: 'Atelier Oils' },
    { id: 'Discovery Sets', label: 'Discovery Sets' },
  ];

  readonly scentFamilyList: readonly { id: ScentFamily; label: string }[] = [
    { id: 'Floral', label: 'Floral' },
    { id: 'Woody', label: 'Woody' },
    { id: 'Oriental', label: 'Oriental' },
    { id: 'Fresh', label: 'Fresh' },
  ];
  readonly occasionList: readonly { id: Occasion; label: string }[] = [
    { id: 'Personal Use', label: 'Personal Use' },
    { id: 'Wedding', label: 'Wedding' },
    { id: 'Gift Sets', label: 'Gift Sets' },
    { id: 'Birthday', label: 'Birthday' },
  ];

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
