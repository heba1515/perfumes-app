import { Occasion, ProductCategory, ScentFamily } from '@features/products/models/product.model';

export type CategoryFilterType = 'scentFamily' | 'category' | 'occasion';

export interface SanityFragranceCategory {
    readonly title: string;
    readonly subtitle: string;
    readonly imageUrl: string;
    readonly badge: string;
    readonly filterType: CategoryFilterType;
    readonly filterValue: string;
}

export interface SanitySiteProduct {
    readonly id: string;
    readonly name: string;
    readonly price: number;
    readonly imageUrl: string;
    readonly description: string;
}

export interface SanitySiteSettings {
    readonly brandName: string;
    readonly hero: {
        readonly eyebrow: string;
        readonly title: string;
        readonly description: string;
        readonly primaryLabel: string;
        readonly secondaryLabel: string;
        readonly featuredProduct?: SanitySiteProduct;
    };
    readonly metrics: readonly { readonly value: string; readonly label: string }[];
    readonly story: {
        readonly eyebrow: string;
        readonly title: string;
        readonly description: string;
        readonly imageUrl: string;
        readonly featuredProduct?: SanitySiteProduct;
        readonly promises: readonly string[];
    };
}

export function toCategoryFilter(category: SanityFragranceCategory): {
    category?: ProductCategory | 'all';
    scentFamilies?: readonly ScentFamily[];
    occasions?: readonly Occasion[];
} {
    switch (category.filterType) {
        case 'category':
            return { category: category.filterValue as ProductCategory };
        case 'occasion':
            return { category: 'all', occasions: [category.filterValue as Occasion] };
        case 'scentFamily':
            return { category: 'all', scentFamilies: [category.filterValue as ScentFamily] };
    }
}
