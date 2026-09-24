import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { SeoService } from '@core/seo';
import { Button } from '@shared/ui/button/button';
import { formatPrice } from '@features/products/utils/product.utils';
import { CartStore } from '@features/cart/state/cart-store';

@Component({
  selector: 'app-checkout-page',
  imports: [ReactiveFormsModule, RouterLink, Button],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPage implements OnInit {
  readonly cartStore = inject(CartStore);

  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  readonly submitted = signal(false);
  readonly orderPlaced = signal(false);
  protected readonly formatPrice = formatPrice;
  readonly formattedSubtotal = computed(() => formatPrice(this.cartStore.subtotal()));
  readonly formattedTotal = computed(() => formatPrice(this.cartStore.total()));

  readonly checkoutForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s()-]{7,}$/)]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['Egypt', Validators.required],
    deliveryNote: [''],
  });

  ngOnInit(): void {
    this.seo.updateMetadata({
      title: 'Checkout',
      description: 'Complete your order from the Odoratus fragrance house.',
      path: '/cart/checkout',
    });

    if (this.cartStore.items().length === 0) {
      void this.router.navigateByUrl('/cart');
    }
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const order = this.checkoutForm.getRawValue();
    const items = this.cartStore.items();
    const itemLines = items.map((item) => {
      const option = item.selectedOption ? ` (${item.selectedOption})` : '';
      return `- ${item.name}${option} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`;
    });
    const message = [
      'New Odoratus order',
      '',
      `Customer: ${order.firstName} ${order.lastName}`,
      `Email: ${order.email}`,
      `Phone: ${order.phone}`,
      `Address: ${order.address}, ${order.city}, ${order.postalCode}, ${order.country}`,
      ...(order.deliveryNote ? ['', `Delivery note: ${order.deliveryNote}`] : []),
      '',
      'Cart items:',
      ...itemLines,
      '',
      `Total: ${formatPrice(this.cartStore.total())}`,
    ].join('\n');
    const whatsappUrl = `https://wa.me/${environment.whatsappNumber}?text=${encodeURIComponent(message)}`;

    this.orderPlaced.set(true);
    this.cartStore.clearCart();
    this.document.location.href = whatsappUrl;
  }

  hasError(controlName: keyof typeof this.checkoutForm.controls): boolean {
    const control = this.checkoutForm.controls[controlName];
    return control.invalid && (control.touched || this.submitted());
  }
}
