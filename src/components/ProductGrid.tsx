import { useMediaQuery } from '@/hooks/useMediaQuery';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import { EnhancedProduct } from '@/config/types';

interface ProductGridProps {
  products: EnhancedProduct[];
  onAddToCart: (product: EnhancedProduct) => void;
  loading?: boolean;
}

const GRID_CLASS = 'grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6';

const ProductGrid = ({ products, onAddToCart, loading = false }: ProductGridProps) => {
  // Check if we're on a mobile device (screen width < 768px)
  const isMobile = useMediaQuery('(max-width: 767px)');

  // While data is loading, show skeleton cards in the same grid layout.
  if (loading) {
    return (
      <div className={GRID_CLASS}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-700">No products found</h2>
        <p className="text-gray-500 mt-2">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className={GRID_CLASS}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() => onAddToCart(product)}
          size={isMobile ? 'small' : 'normal'}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
