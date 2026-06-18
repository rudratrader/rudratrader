import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn, PLACEHOLDER_IMAGE } from '@/lib/utils';
import { EnhancedProduct } from '@/config/types';

interface ProductDetailsProps {
  product: EnhancedProduct;
  onAddToCart: () => void;
}

/**
 * Presentational product detail view (images + info + add-to-cart).
 * Shared by the in-card quick-view popup and the standalone product page so
 * both stay in sync.
 */
const ProductDetails = ({ product, onAddToCart }: ProductDetailsProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const imageUrls = product.images?.length ? product.images : [{ url: PLACEHOLDER_IMAGE }];

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
  }).format(product.price);

  // Keep our index in sync when the carousel is swiped/dragged.
  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setActiveImageIndex(carouselApi.selectedScrollSnap());
    onSelect();
    carouselApi.on('select', onSelect);
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi]);

  // Drive the carousel when a thumbnail is clicked.
  useEffect(() => {
    if (!carouselApi || carouselApi.selectedScrollSnap() === activeImageIndex) return;
    carouselApi.scrollTo(activeImageIndex);
  }, [carouselApi, activeImageIndex]);

  return (
    <div className="grid gap-3 md:grid-cols-2 md:gap-4">
      {/* Product Images Carousel */}
      <div className="product-images w-full">
        <Carousel
          opts={{ loop: true, align: 'start' }}
          className="w-full"
          setApi={setCarouselApi}
        >
          <CarouselContent>
            {imageUrls.map((obj, index) => (
              <CarouselItem key={index}>
                <AspectRatio ratio={1 / 1} className="bg-muted rounded-md">
                  <img
                    src={obj.url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-contain bg-[#f5ece0]"
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          {imageUrls.length > 1 && (
            <>
              <CarouselPrevious className="left-1 sm:left-2 h-6 w-6 sm:h-8 sm:w-8" />
              <CarouselNext className="right-1 sm:right-2 h-6 w-6 sm:h-8 sm:w-8" />
            </>
          )}
        </Carousel>

        {/* Thumbnails */}
        {imageUrls.length > 1 && (
          <div className="flex flex-wrap mt-2 gap-1 sm:gap-2 pb-1 justify-center sm:justify-start overflow-x-auto">
            {imageUrls.map((obj, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={cn(
                  'relative h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 flex-shrink-0 rounded-md overflow-hidden border-2',
                  activeImageIndex === index ? 'border-primary' : 'border-transparent'
                )}
                aria-label={`View image ${index + 1} of ${imageUrls.length}`}
                aria-selected={activeImageIndex === index}
              >
                <img
                  src={obj.url}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col w-full overflow-x-hidden">
        <div className="mb-2 md:mb-3">
          <h1 className="text-base sm:text-base md:text-lg lg:text-xl font-bold text-primary break-words whitespace-normal">
            {product.name}
          </h1>
        </div>

        <div className="mb-2 md:mb-3">
          <p className="text-xl sm:text-base md:text-lg lg:text-xl font-bold text-primary">
            {formattedPrice}
          </p>
        </div>

        {product.description && (
          <div className="mb-2 md:mb-3">
            <p className="text-xs sm:text-sm md:text-base text-gray-600 break-words whitespace-normal">
              {product.description}
            </p>
          </div>
        )}

        <div className="space-y-2 md:space-y-3">
          <div className="flex flex-row items-start">
            <h3 className="text-xs sm:text-sm md:text-base font-medium w-14 sm:w-16 md:w-20 flex-shrink-0">
              Brand
            </h3>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm md:text-base break-words whitespace-normal">
                {product.brandName}
              </p>
            </div>
          </div>

          <div className="flex flex-row items-start">
            <h3 className="text-xs sm:text-sm md:text-base font-medium w-14 sm:w-16 md:w-20 flex-shrink-0">
              Category
            </h3>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm md:text-base break-words whitespace-normal">
                {product.categoryName}
              </p>
            </div>
          </div>

          <div className="flex flex-row items-start">
            <h3 className="text-xs sm:text-sm md:text-base font-medium w-14 sm:w-16 md:w-20 flex-shrink-0">
              Net Qty
            </h3>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm md:text-base break-words">{product.quantity}</p>
            </div>
          </div>
        </div>

        <Button
          onClick={onAddToCart}
          className="w-full mt-4 md:mt-6 bg-[#624d15] hover:bg-amber-800"
          size="default"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails;
