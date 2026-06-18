import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ShoppingCart, Eye } from 'lucide-react';
import { cn, PLACEHOLDER_IMAGE } from '@/lib/utils';
import ProductDetails from '@/components/ProductDetails';
import { EnhancedProduct } from '@/config/types';

interface ProductCardProps {
  product: EnhancedProduct;
  onAddToCart: () => void;
  size?: 'small' | 'normal';
}

const ProductCard = ({ product, onAddToCart, size = 'normal' }: ProductCardProps) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
  }).format(product.price);

  const primaryImage = product.images?.[0]?.url || PLACEHOLDER_IMAGE;

  // The card is an overlay <Link> (for shareable / open-in-new-tab navigation).
  // The action buttons sit above it (higher z-index) and stop the event so they
  // never trigger navigation.
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart();
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <div className="w-full h-full">
      <Card
        className="group relative h-full flex flex-col overflow-hidden rounded-xl transition-all hover:shadow-md cursor-pointer w-full pt-0 pb-2 text-center bg-[#fffbf4] gap-1"
      >
        {/* Product image */}
        <AspectRatio ratio={1 / 1} className="bg-muted relative">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-contain bg-[#f5ece0]"
            loading="lazy"
          />

          {/* Quick view — opens the details popup in place */}
          <Button
            onClick={handleQuickView}
            size="icon"
            variant="secondary"
            className="absolute top-1 right-1 z-20 h-8 w-8 rounded-full shadow-md bg-white/85 hover:bg-white text-[#624d15] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 max-md:opacity-100 transition-opacity"
            aria-label={`Quick view ${product.name}`}
          >
            <Eye className="h-4 w-4" />
          </Button>

          {/* Add to cart */}
          <Button
            onClick={handleAddToCart}
            size="icon"
            variant="default"
            className="absolute bottom-1 right-1 z-20 h-8 w-8 rounded-full shadow-md flex items-center justify-center bg-[#624d15] hover:bg-amber-800 border-yellow-300 border"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </AspectRatio>

        {/* Product info */}
        <CardContent
          className={cn(
            'p-2 flex flex-col flex-1',
            size === 'small' ? 'md:p-3' : 'p-2 md:p-4'
          )}
        >
          <h3 className="flex-1 font-medium text-gray-800 text-sm md:text-base break-words whitespace-normal">
            {product.name}
          </h3>

          <div className="mt-1 w-full flex items-center justify-around">
            <div className="text-xs md:text-sm font-medium text-gray-500 break-words whitespace-normal max-w-[45%]">
              {product.quantity}
            </div>
            <span className="text-sm md:text-base font-semibold max-w-[50%] break-words whitespace-normal">
              {formattedPrice}
            </span>
          </div>
        </CardContent>

        {/* Full-card navigation overlay (kept below the buttons in z-order) */}
        <Link
          to={`/product/${product.id}`}
          className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`View details of ${product.name}`}
        >
          <span className="sr-only">View details of {product.name}</span>
        </Link>
      </Card>

      {/* Quick-view popup — same details UI as the product page */}
      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent className="sm:max-w-[95vw] md:max-w-3xl max-h-[90vh] p-2 md:p-4 mx-auto flex flex-col overflow-x-hidden">
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
          <div className="overflow-y-auto overflow-x-hidden flex-1 -mr-2 pr-2">
            <ProductDetails product={product} onAddToCart={onAddToCart} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductCard;
