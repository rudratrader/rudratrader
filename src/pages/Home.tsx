import { useState, useEffect, useRef } from 'react';
import { useNavigationType } from 'react-router-dom';
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

const HOME_VIEW_KEY = 'homeViewState';
const HOME_SCROLL_KEY = 'homeScrollY';

const DEFAULT_FILTERS: FilterState = {
  categoryId: null,
  subCategoryId: null,
  brandId: null,
  searchQuery: '',
  sortBy: null,
};

// Restore the last home view (filters + page) so returning from a product
// drops the user back where they were.
const readHomeView = (): { filters: FilterState; currentPage: number } | null => {
  try {
    const raw = sessionStorage.getItem(HOME_VIEW_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const Home = () => {
  const navigationType = useNavigationType();

  // Shared catalogue + cart
  const { products, brands, categories, subCategories, loading, error } = useProductDataContext();
  const { addToCart } = useCart();

  // Filter + pagination state (restored from the last home view when present)
  const [filters, setFilters] = useState<FilterState>(() => readHomeView()?.filters ?? DEFAULT_FILTERS);
  const [pagination, setPagination] = useState<PaginationState>(() => ({
    currentPage: readHomeView()?.currentPage ?? 1,
    itemsPerPage: 16,
    totalItems: 0,
  }));

  // Persist the current view (filters + page) for when we come back.
  useEffect(() => {
    try {
      sessionStorage.setItem(
        HOME_VIEW_KEY,
        JSON.stringify({ filters, currentPage: pagination.currentPage })
      );
    } catch {
      /* ignore storage errors */
    }
  }, [filters, pagination.currentPage]);

  // Remember the scroll position at the moment a product is opened (captured on
  // click, before the route change resets scroll — immune to navigation timing).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('a[href^="/product/"]')) {
        try {
          sessionStorage.setItem(HOME_SCROLL_KEY, String(window.scrollY));
        } catch {
          /* ignore */
        }
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // On back/forward (POP), restore the saved scroll position. Retry across a few
  // frames because the grid needs a moment to lay out (and become tall enough to
  // scroll) after the page re-mounts.
  const scrollRestored = useRef(false);
  useEffect(() => {
    if (scrollRestored.current || navigationType !== 'POP' || loading || products.length === 0) {
      return;
    }
    scrollRestored.current = true;
    const y = Number(sessionStorage.getItem(HOME_SCROLL_KEY)) || 0;
    if (y <= 0) return;

    let frames = 0;
    const restore = () => {
      window.scrollTo(0, y);
      frames += 1;
      if (Math.abs(window.scrollY - y) > 2 && frames < 30) {
        requestAnimationFrame(restore);
      }
    };
    requestAnimationFrame(restore);
  }, [navigationType, loading, products.length]);

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
