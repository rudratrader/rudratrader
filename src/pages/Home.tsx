import { useState } from 'react';
import { useProductDataContext } from '@/context/ProductDataContext';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import ProductGrid from '@/components/ProductGrid';
import PaginationControls from '@/components/PaginationControls';
import ErrorDisplay from '@/components/ErrorDisplay';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { SITE, WEBSITE_JSONLD, ORGANIZATION_JSONLD } from '@/config/site';
import { FilterState, PaginationState } from '@/config/types';

const Home = () => {
  // Shared catalogue + cart
  const { products, brands, categories, subCategories, loading, error } = useProductDataContext();
  const { addToCart } = useCart();

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    categoryId: null,
    subCategoryId: null,
    brandId: null,
    searchQuery: '',
    sortBy: null,
  });

  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 16,
    totalItems: 0,
  });

  // Filter products
  const filteredProducts = products.filter((product) => {
    if (
      filters.searchQuery &&
      !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (filters.categoryId && product.categoryId !== filters.categoryId) {
      return false;
    }
    if (filters.subCategoryId && product.subCategoryId !== filters.subCategoryId) {
      return false;
    }
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
    setFilters(newFilters);
    // Reset pagination to page 1 whenever filters change
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate paginated products
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const endIndex = startIndex + pagination.itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedProducts.length / pagination.itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F3] flex flex-col">
      <Seo
        title="Rudra Trader - Agarbatti, Dhoop & Incense | Hyderabad"
        description={SITE.description}
        path="/"
        jsonLd={[WEBSITE_JSONLD, ORGANIZATION_JSONLD]}
      />

      {/* Navigation with search, filters and cart - all integrated */}
      <Navbar
        searchQuery={filters.searchQuery}
        onSearchChange={(query) => {
          setFilters((prev) => ({ ...prev, searchQuery: query }));
          // Reset to the first page so results aren't hidden behind a stale page offset
          setPagination((prev) => ({ ...prev, currentPage: 1 }));
        }}
        categories={categories}
        subCategories={subCategories}
        brands={brands}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Main content area */}
      <main className="container mt-20 sm:mt-20 md:mt-12 lg:mt-12 mx-auto px-4 pt-8 pb-10 flex-1">
        {error ? (
          <ErrorDisplay message={error} />
        ) : (
          <div className="flex flex-col">
            {/* Products grid (shows skeletons while loading) */}
            <ProductGrid products={paginatedProducts} onAddToCart={addToCart} loading={loading} />

            {/* Pagination controls */}
            {!loading && totalPages > 1 && (
              <div className="mt-4 mb-4">
                <PaginationControls
                  currentPage={pagination.currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
