import { Product, ProductFilterCriteria, ProductSortOption } from '../models/product.model';

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function filterProducts(products: Product[], filters: ProductFilterCriteria): Product[] {
  return products.filter((product) => {
    if (filters.search) {
      const query = filters.search.toLowerCase().trim();
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesDesc = product.description.toLowerCase().includes(query);
      if (!matchesName && !matchesDesc) {
        return false;
      }
    }

    if (filters.category && filters.category !== 'all') {
      if (product.category !== filters.category) {
        return false;
      }
    }

    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false;
    }

    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false;
    }

    if (filters.inStockOnly && !product.inStock) {
      return false;
    }

    if (filters.scentFamilies && filters.scentFamilies.length > 0) {
      if (!filters.scentFamilies.includes(product.scentFamily)) {
        return false;
      }
    }

    if (filters.occasions && filters.occasions.length > 0) {
      if (!filters.occasions.includes(product.occasion)) {
        return false;
      }
    }

    return true;
  });
}

export function sortProducts(products: Product[], sort: ProductSortOption): Product[] {
  const copy = [...products];
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating);
    case 'featured':
    default:
      return copy;
  }
}
