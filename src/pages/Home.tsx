import { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Product } from "../config";
import Navbar from "@/components/Navbar";
import fuzzysort from "fuzzysort";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Home = () => {
  // Keep all your existing state variables
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingImage, setViewingImage] = useState<Product | null>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
  // New state for tracking which image in the carousel is selected in the popup
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

  // Helper function to get images array from a product
// Helper function to get images array from a product
const getProductImages = (product: Product): string[] => {
  if (!product.image) return [];
  
  // If image is already an array, return it
  if (Array.isArray(product.image)) return product.image;
  
  try {
    // If it's a JSON array string (e.g., ["url1","url2"])
    const parsedImages = JSON.parse(product.image);
    return Array.isArray(parsedImages) ? parsedImages : [product.image];
  } catch (e) {
    console.error("Error parsing image URLs:", e);
    return [product.image];
  }
};

  useEffect(() => {
    // Keep your existing data loading logic
    setLoading(true);
    axios
      .get(import.meta.env.VITE_SHEET_LINK, { responseType: "blob" })
      .then((response) =>
        Papa.parse(response.data, {
          header: true,
          complete: (results) => {
            // Transform the parsed data to ensure it matches the Product type
            const parsedProducts: Product[] = results.data
              .filter((item: any) => item.id && item.name)
              .map((item: any) => ({
                id: String(item.id || ""),
                name: String(item.name || ""),
                category: String(item.category || ""),
                price: Number(item.price || 0),
                image: String(item.image || "").trim(),
              }));

            setProducts(parsedProducts);
            setLoading(false);
          },
          error: (error) => console.error("Error parsing CSV:", error),
        })
      )
      .catch(error => {
        console.error("Error fetching CSV:", error);
        setLoading(false);
      });
  }, []);

  // Keep all your existing functions
  const addToCart = (product: Product) => {
    // Your existing code
    setCart((prevCart) => ({
      ...prevCart,
      [product.id]: (prevCart[product.id] || 0) + 1,
    }));
  };

  const removeFromCart = (product: Product) => {
    // Your existing code
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[product.id] > 1) {
        updatedCart[product.id] -= 1;
      } else {
        delete updatedCart[product.id];
      }
      return updatedCart;
    });
  };

  const handleCheckout = () => {
    // Your existing code
    const cartItems = Object.keys(cart).map((id) => ({
      ...products.find((p) => p.id === id),
      quantity: cart[id],
    }));
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
    const message = cartItems
      .map(
        (item) =>
          `${item.quantity} × ₹${item.price} = ₹${
            item.quantity * Number(item.price)
          } - ${item.name}`
      )
      .join("\n");
    const url = `https://wa.me/${
      import.meta.env.VITE_WHATSAPP_NUMBER
    }?text=${encodeURIComponent(
      "Order Details:\n" + message + `\n\nTotal: ₹${totalAmount}`
    )}`;
    window.location.href = url;
  };

  // Handle image loading errors
  const handleImageError = (imageUrl: string) => {
    setImageErrors(prev => ({
      ...prev,
      [imageUrl]: true
    }));
  };

  // Your existing filtering and pagination code
  const filteredProducts = searchQuery
    ? fuzzysort
        .go(searchQuery, products, { key: "name" })
        .map((result) => result.obj)
    : products;

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div className="flex flex-col h-screen">
      <Navbar
        cart={cart}
        products={products}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        checkout={handleCheckout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Add top padding to push content below Navbar */}
      <div className="flex-1 overflow-auto p-2 pt-20">
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : (
          <>
            {/* Responsive Product Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full px-4">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => {
                  const productImages = getProductImages(product);
                  const hasMultipleImages = productImages.length > 1;
                  
                  return (
                    <div
                      key={product.id}
                      className="border p-4 rounded-xl flex flex-col items-center shadow-md hover:shadow-lg transition-shadow w-full bg-white"
                    >
                      {/* Image Wrapper (Fixed width & height) */}
                      <div className="w-full flex justify-center items-center h-32 overflow-hidden relative">
                        {productImages.length > 0 ? (
                          hasMultipleImages ? (
                            <Carousel className="w-full" opts={{ loop: true }}>
                              <CarouselContent>
                                {productImages.map((imgUrl, index) => (
                                  <CarouselItem key={index}>
                                    {!imageErrors[imgUrl] ? (
                                      <img
                                        src={imgUrl}
                                        alt={`${product.name} - Image ${index + 1}`}
                                        className="max-w-[100px] h-full object-contain cursor-pointer hover:opacity-80 transition-opacity mx-auto"
                                        onClick={() => {
                                          setViewingImage(product);
                                          setActiveImageIndex(index);
                                        }}
                                        onError={() => handleImageError(imgUrl)}
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                      />
                                    ) : (
                                      <div className="flex items-center justify-center w-full h-24 text-gray-400 bg-gray-100 rounded">
                                        Image Error
                                      </div>
                                    )}
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                              <CarouselPrevious className="h-6 w-6 -left-1" />
                              <CarouselNext className="h-6 w-6 -right-1" />
                            </Carousel>
                          ) : (
                            // Single image - use existing code
                            !imageErrors[productImages[0]] ? (
                              <img
                                src={productImages[0]}
                                alt={product.name}
                                className="max-w-[100px] h-full object-contain cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => {
                                  setViewingImage(product);
                                  setActiveImageIndex(0);
                                }}
                                onError={() => handleImageError(productImages[0])}
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gray-100 rounded">
                                No Image
                              </div>
                            )
                          )
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gray-100 rounded">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Name (Ensures proper spacing) */}
                      <h2 className="text-md font-semibold mt-2 text-center whitespace-normal">
                        {product.name}
                      </h2>

                      {/* Price */}
                      <p className="text-gray-700 font-bold text-md">
                        ₹{Number(product.price)}
                      </p>

                      {/* Add to Cart Button (Proper spacing) */}
                      <Button
                        onClick={() => addToCart(product)}
                        className="mt-3 w-full text-sm bg-yellow-400 hover:bg-yellow-300 text-black"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 col-span-full">
                  No products found
                </p>
              )}
            </div>

            {/* Pagination - keep your existing code */}
            {filteredProducts.length > productsPerPage && (
              <div className="overflow-x-auto">
                <Pagination className="mt-4">
                  <PaginationContent>
                    {/* Previous Button */}
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        aria-disabled={currentPage === 1}
                        className={`cursor-pointer ${
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }`}
                      />
                    </PaginationItem>

                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          isActive={i + 1 === currentPage}
                          onClick={() => setCurrentPage(i + 1)}
                          className="text-xs cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {/* Next Button */}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        aria-disabled={currentPage === totalPages}
                        className={`cursor-pointer ${
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      {/* Image Popup Dialog with Carousel */}
      <Dialog open={!!viewingImage} onOpenChange={(open) => !open && setViewingImage(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] p-1 sm:p-6 border-none shadow-none bg-transparent">
          <DialogHeader className="sm:mb-2">
            <DialogTitle className="text-center text-white">{viewingImage?.name}</DialogTitle>
          </DialogHeader>
          
          {/* Show carousel in popup if product has multiple images */}
          {viewingImage && (
            <div className="flex items-center justify-center overflow-auto">
              {(() => {
                const images = getProductImages(viewingImage);
                
                if (images.length > 1) {
                  return (
                    <Carousel className="w-full" opts={{ loop: true, startIndex: activeImageIndex }} >
                      <CarouselContent>
                        {images.map((imgUrl, index) => (
                          <CarouselItem key={index}>
                            {!imageErrors[imgUrl] ? (
                              <img 
                                src={imgUrl} 
                                alt={`${viewingImage.name} - Image ${index + 1}`} 
                                className="max-w-full max-h-[80vh] object-contain mx-auto"
                                onError={() => handleImageError(imgUrl)}
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-64 text-gray-400 bg-gray-100 rounded">
                                Image Not Available
                              </div>
                            )}
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-2 sm:left-4 bg-black/30 hover:bg-black/50 text-white" />
                      <CarouselNext className="right-2 sm:right-4 bg-black/30 hover:bg-black/50 text-white" />
                    </Carousel>
                  );
                } else if (images.length === 1 && !imageErrors[images[0]]) {
                  // Original single image display
                  return (
                    <img 
                      src={images[0]} 
                      alt={viewingImage.name} 
                      className="max-w-full max-h-[80vh] object-contain"
                      onError={() => handleImageError(images[0])}
                    />
                  );
                } else {
                  return (
                    <div className="flex items-center justify-center w-full h-64 text-gray-400 bg-gray-100 rounded">
                      Image Not Available
                    </div>
                  );
                }
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;