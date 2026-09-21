export interface CartItem {
  readonly id: string;
  readonly productId: string;
  readonly name: string;
  readonly price: number;
  readonly imageUrl?: string;
  quantity: number;
  readonly selectedOption?: string;
}

export interface CartSummary {
  readonly totalItems: number;
  readonly subtotal: number;
  readonly tax: number;
  readonly total: number;
}
