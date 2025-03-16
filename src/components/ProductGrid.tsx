import { useMediaQuery } from '@/hooks/useMediaQuery';
import ProductCard from '@/components/ProductCard';
import {EnhancedProduct} from '@/config/types'

// interface Product {
//   id: string;
//   name: string;
//   category: string;
//   price: number;
//   image: string;
// }

interface ProductGridProps {
  products: EnhancedProduct[];
  onAddToCart: (product: EnhancedProduct) => void;
}

const ProductGrid = ({ products, onAddToCart }: ProductGridProps) => {
  // Check if we're on a mobile device (screen width < 768px)
  const isMobile = useMediaQuery('(max-width: 767px)');
  // console.log(products)
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-700">No products found</h2>
        <p className="text-gray-500 mt-2">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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