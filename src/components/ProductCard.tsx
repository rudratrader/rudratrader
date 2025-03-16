import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ShoppingCart} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { EnhancedProduct } from '@/config/types'

interface ProductCardProps {
  product: EnhancedProduct;
  onAddToCart: () => void;
  size?: 'small' | 'normal';
}

const ProductCard = ({ 
  product, 
  onAddToCart,
  size = 'normal'
}: ProductCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  
  // Format price as currency
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR'
  }).format(product.price);
  
  // Helper function to extract image URLs
  const getProductImages = (product: EnhancedProduct): string[] => {
    if (!product.image) return [];
    
    // Handle case where image is already an array
    if (Array.isArray(product.image)) return product.image;
    
    try {
      // Try to parse as JSON array
      const parsedImages = JSON.parse(product.image);
      
      if (Array.isArray(parsedImages)) {
        // Handle case where array elements might be comma-separated URLs
        return parsedImages.flatMap(item => {
          if (typeof item === 'string' && item.includes(',')) {
            return item.split(',').map(url => url.trim());
          }
          return item;
        });
      } else if (typeof parsedImages === 'string' && parsedImages.includes(',')) {
        // Handle case where parsed result is a comma-separated string
        return parsedImages.split(',').map(url => url.trim());
      } else {
        // Use parsed result as a single item
        return [parsedImages];
      }
    } catch (e) {
      // If parsing fails, check if the string contains commas
      if (typeof product.image === 'string' && product.image.includes(',')) {
        return product.image.split(',').map(url => url.trim());
      }
      // Default: use as single URL
      return [product.image];
    }
  };

  const imageUrls = getProductImages(product);
  
  // Handle click on Add to Cart button without opening dialog
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart();
  };

  // When card is clicked, open the dialog
  const handleCardClick = () => {
    setIsDialogOpen(true);
  };
  
  // Update carousel when activeImageIndex changes
  useEffect(() => {
    if (!carouselApi) return;
    
    // Function to update our state when carousel changes
    const onSelect = () => {
      const currentIndex = carouselApi.selectedScrollSnap();
      setActiveImageIndex(currentIndex);
    };
    
    // Call once to set initial state
    onSelect();
    
    // Register the event listener
    carouselApi.on("select", onSelect);
    
    // Cleanup
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // This one ensures carousel updates when activeImageIndex changes
  useEffect(() => {
    if (!carouselApi || carouselApi.selectedScrollSnap() === activeImageIndex) return;
    carouselApi.scrollTo(activeImageIndex);
  }, [carouselApi, activeImageIndex]);

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index);
  };

  return (
    <div className="w-full">
      {/* Product Card */}
      <Card 
        className="rounded-b-none overflow-hidden transition-all hover:shadow-md cursor-pointer w-full pt-0 pb-2 text-center bg-[#fffbf4] gap-1" 
        onClick={handleCardClick}
        tabIndex={0}
        role="button"
        aria-label={`View details of ${product.name}`}
      >

        {/* Product image */}
        <AspectRatio ratio={1/1} className="bg-muted relative">
          <img 
            src={imageUrls[0] || '/placeholder-image.jpg'} 
            alt={product.name}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        <Button 
          onClick={handleAddToCart} 
          size="icon"
          variant="default"
          className="absolute bottom-1 right-1 h-8 w-8 rounded-full shadow-md flex items-center justify-center bg-[#624d15] hover:bg-amber-800 border-yellow-300 border"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart className="h-6 w-6" />
        </Button>
        </AspectRatio>
        
        {/* Product info with improved responsive text handling */}
        <CardContent className={cn(
          "p-2 flex flex-col",
          size === 'small' ? 'md:p-3' : 'p-2 md:p-4'
        )}>
          <h3 className={cn(
            "font-medium text-gray-800 text-s md:text-base break-words whitespace-normal overflow-wrap-anywhere"
          )}>
            {product.name}
          </h3>
          
          <div className="mt-1 w-full flex items-center justify-around">
            <div className="text-s font-medium text-gray-500 break-words whitespace-normal overflow-wrap-anywhere max-w-[40%]">
              {product.quantity}
            </div>

            <span className="text-s md:text-base font-semibold max-w-[40%] break-words whitespace-normal overflow-wrap-anywhere">
              {formattedPrice}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Product Detail Dialog - with improved responsive layout */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[95vw] md:max-w-3xl max-h-[90vh] p-2 md:p-4 mx-auto flex flex-col overflow-x-hidden">
          <div className="overflow-y-auto overflow-x-hidden flex-1 -mr-2 pr-2">
            <div className="grid gap-3 md:grid-cols-2 md:gap-4">
              {/* Product Images Carousel */}
              <div className="product-images w-full">
                <Carousel
                  opts={{
                    loop: true,
                    align: "start",
                  }}
                  className="w-full"
                  setApi={setCarouselApi}
                >
                  <CarouselContent>
                    {imageUrls.map((url, index) => (
                      <CarouselItem key={index}>
                        <AspectRatio ratio={1/1} className="bg-muted rounded-md">
                          <img
                            src={url}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-contain"
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
                
                {/* Thumbnail images with responsive sizing */}
                {imageUrls.length > 1 && (
                  <div className="flex flex-wrap mt-2 gap-1 sm:gap-2 pb-1 justify-center sm:justify-start overflow-x-auto">
                    {imageUrls.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={cn(
                          "relative h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 flex-shrink-0 rounded-md overflow-hidden border-2",
                          activeImageIndex === index ? "border-primary" : "border-transparent"
                        )}
                        aria-label={`View image ${index + 1} of ${imageUrls.length}`}
                        aria-selected={activeImageIndex === index}
                      >
                        <img
                          src={url}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details with improved responsive text */}
              <div className="flex flex-col w-full overflow-x-hidden">
                <div className="mb-2 md:mb-3">
                  <p className="text-base sm:text-base md:text-lg lg:text-xl font-bold text-primary break-words whitespace-normal overflow-wrap-anywhere">
                    {product.name}
                  </p>
                </div>

                <div className="mb-2 md:mb-3">
                  <p className="text-xl sm:text-base md:text-lg lg:text-xl font-bold text-primary">
                    {formattedPrice}
                  </p>
                </div>

                {product.description && (
                  <div className="mb-2 md:mb-3">
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 break-words whitespace-normal overflow-wrap-anywhere">
                      {product.description}
                    </p>
                  </div>
                )}
                
                {/* Product information sections with responsive layout */}
                <div className="space-y-2 md:space-y-3">
                  <div className="flex flex-row items-start">
                    <h3 className="text-xs sm:text-sm md:text-base font-medium w-14 sm:w-16 md:w-20 flex-shrink-0">
                      Brand
                    </h3>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm md:text-base break-words whitespace-normal overflow-wrap-anywhere">
                        {product.brandName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-row items-start">
                    <h3 className="text-xs sm:text-sm md:text-base font-medium w-14 sm:w-16 md:w-20 flex-shrink-0">
                      Category
                    </h3>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm md:text-base break-words whitespace-normal overflow-wrap-anywhere">
                        {product.categoryName}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row items-start">
                    <h3 className="text-xs sm:text-sm md:text-base font-medium w-14 sm:w-16 md:w-20 flex-shrink-0">
                      Net Qty
                    </h3>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm md:text-base break-words">
                        {product.quantity}
                      </p>
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductCard;