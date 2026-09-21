import { ChangeDetectionStrategy, Component, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-search',
  imports: [FormsModule],
  templateUrl: './product-search.html',
  styleUrl: './product-search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSearch {
  readonly searchTerm = model<string>('');
  readonly searchChange = output<string>();

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.searchChange.emit(value);
  }

  protected onClear(): void {
    this.searchTerm.set('');
    this.searchChange.emit('');
  }
}
