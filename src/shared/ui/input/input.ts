import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.html',
  styleUrl: './input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Input {
  readonly id = input<string>('');
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly type = input<'text' | 'number' | 'search' | 'email'>('text');
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly value = model<string>('');

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }
}
