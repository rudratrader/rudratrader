/**
 * Core data types for the e-commerce application
 */

// Product type based on Google Sheets data structure
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string; // Comma-separated image URLs
  brandId: string;
  categoryId: string;
  subCategoryId: string;
  quantity: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

// Brand type based on Google Sheets data structure
export interface Brand {
  id: string;
  brandName: string;
  createdAt?: string;
  updatedAt?: string;
}

// Category type based on Google Sheets data structure
export interface Category {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// SubCategory type based on Google Sheets data structure
export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  createdAt?: string;
  updatedAt?: string;
}

// Enhanced product with related entity data
export interface EnhancedProduct extends Product {
  brandName: string;
  categoryName: string;
  subCategoryName: string;
  imageArray: string[]; // Parsed image URLs as array
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