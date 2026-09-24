export type ProductCategory =
  | 'Pure Extractions'
  | 'Private Reserve'
  | 'Atelier Oils'
  | 'Discovery Sets'
  ;

export type ScentFamily = 'Floral' | 'Woody' | 'Oriental' | 'Fresh';
export type Occasion = 'Personal Use' | 'Wedding' | 'Gift Sets' | 'Birthday';

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly category: ProductCategory;
  readonly imageUrl: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly inStock: boolean;
  readonly scentFamily: ScentFamily;
  readonly occasion: Occasion;
  readonly options?: readonly string[];
}

export interface ProductFilterCriteria {
  readonly search?: string;
  readonly category?: ProductCategory | 'all';
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly inStockOnly?: boolean;
  readonly scentFamilies?: readonly ScentFamily[];
  readonly occasions?: readonly Occasion[];
}

export type ProductSortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';
