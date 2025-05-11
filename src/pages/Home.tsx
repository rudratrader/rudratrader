import { useState } from 'react';
import { useProductData } from '@/hooks/useProductData';
import Navbar from '@/components/Navbar';
import ProductGrid from '@/components/ProductGrid';
import PaginationControls from '@/components/PaginationControls';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import { Toaster, toast } from 'sonner';
import { EnhancedProduct, FilterState, PaginationState } from '@/config/types';

const Home = () => {
  // Fetch product data using our hook
  const { products, brands, categories, subCategories, loading, error } = useProductData();
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    categoryId: null,
    subCategoryId: null,
    brandId: null,
    searchQuery: '',
    sortBy: null
  });
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 16,
    totalItems: 0
  });
  
  // Cart state
  const [cartItems, setCartItems] = useState<{product: EnhancedProduct, quantity: number}[]>([]);
  
  // UI states
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    // Filter by search query
    if (filters.searchQuery && !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (filters.categoryId && product.categoryId !== filters.categoryId) {
      return false;
    }
    
    // Filter by subcategory
    if (filters.subCategoryId && product.subCategoryId !== filters.subCategoryId) {
      return false;
    }
    
    // Filter by brand
    if (filters.brandId && product.brandId !== filters.brandId) {
      return false;
    }
    
    return true;
  });

  // Sort products based on sort selection
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!filters.sortBy) return 0;
    
    switch (filters.sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const handleFilterChange = (newFilters: FilterState) => {
    // Update filters
    setFilters(newFilters);
    
    // Reset pagination to page 1 whenever filters change
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
    
    // Optional: scroll to top when filters change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate paginated products
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const endIndex = startIndex + pagination.itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedProducts.length / pagination.itemsPerPage);
  
  // Handler for adding product to cart
  const addToCart = (product: EnhancedProduct) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        // Add new product to cart
        return [...prevItems, { product, quantity: 1 }];
      }
    });
    
    toast.success(
      `${product.name} has been added to your cart.`,
      {
        description: "You can view your cart by clicking the cart icon",
        duration: 2000,
      }
    );
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  // Update cart item quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(prev => 
      prev.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Disable filters when loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error if there's one
  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notifications */}
      <Toaster />
      
      {/* Navigation with search, filters and cart - all integrated */}
      <Navbar 
        searchQuery={filters.searchQuery}
        onSearchChange={(query) => setFilters(prev => ({ ...prev, searchQuery: query }))}
        cartItemsCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        isCartOpen={isCartOpen}
        cartItems={cartItems}
        onRemoveFromCart={removeFromCart}
        onUpdateQuantity={updateQuantity}
        // Filter props
        categories={categories}
        subCategories={subCategories}
        brands={brands}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      {/* Main content area */}
      <main className="container mt-20 mx-auto px-4 py-8">
        {/* Products grid */}
        <div className="flex-1">
          <ProductGrid 
            products={paginatedProducts}
            onAddToCart={addToCart}
          />
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="mt-8">
              <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;