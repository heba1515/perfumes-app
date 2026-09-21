import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_CONFIG } from '@core/config';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  private readonly config = inject(APP_CONFIG, { optional: true });
  readonly appName = this.config?.appName ?? 'Storefront';
  readonly currentYear = new Date().getFullYear();
}
