/**
 * Core data types for the e-commerce application
 */

export interface ProductImage {
  url: string;
  public_id?: string;
}

export interface EnhancedProduct {
  id: string;
  name: string;
  price: number;
  image: string; // Comma-separated image URLs
  brandId: string;
  categoryId: string;
  subCategoryId: string;
  quantity: string;
  description: string;
  brandName: string;
  categoryName: string;
  subCategoryName: string;
  images: ProductImage[]; // Parsed image URLs as array
}

// Brand type based on Google Sheets data structure
export interface Brand {
  id: string;
  brandName: string;
}

// Category type based on Google Sheets data structure
export interface Category {
  id: string;
  categoryName: string;
}

// SubCategory type based on Google Sheets data structure
export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  createdAt?: string;
  updatedAt?: string;
}


// Cart item with quantity
export interface CartItem {
  product: EnhancedProduct;
  quantity: number;
}

// Filter state for product filtering
export interface FilterState {
  categoryId: string | null;
  subCategoryId: string | null;
  brandId: string | null;
  searchQuery: string;
  sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | null;
}

// Pagination state
export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}