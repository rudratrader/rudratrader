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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingImage, setViewingImage] = useState<Product | null>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

  useEffect(() => {
    setLoading(true);
    axios
      .get(import.meta.env.VITE_SHEET_LINK, { responseType: "blob" })
      .then((response) =>
        Papa.parse(response.data, {
          header: true,
          complete: (results) => {
            // Transform the parsed data to ensure it matches the Product type
            const parsedProducts: Product[] = results.data
              .filter((item: any) => item.id && item.name) // Filter out invalid entries
              .map((item: any) => ({
                id: String(item.id || ""),
                name: String(item.name || ""),
                category: String(item.category || ""),
                price: Number(item.price || 0),
                image: String(item.image || "").trim(), // Trim whitespace from URLs
              }));

            // Now the data is properly typed as Product[]
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

  const addToCart = (product: Product) => {
    setCart((prevCart) => ({
      ...prevCart,
      [product.id]: (prevCart[product.id] || 0) + 1,
    }));
  };

  const removeFromCart = (product: Product) => {
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
  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  // Filter products based on search query
  const filteredProducts = searchQuery
    ? fuzzysort
        .go(searchQuery, products, { key: "name" })
        .map((result) => result.obj)
    : products;

  // Pagination calculations
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
                currentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border p-4 rounded-xl flex flex-col items-center shadow-md hover:shadow-lg transition-shadow w-full bg-white"
                  >
                    {/* Image Wrapper (Fixed width & height) */}
                    <div className="w-full flex justify-center items-center h-32 overflow-hidden">
                      {product.image && !imageErrors[product.id] ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-w-[100px] h-full object-contain cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setViewingImage(product)}
                          onError={() => handleImageError(product.id)}
                          loading="lazy"
                        />
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
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full">
                  No products found
                </p>
              )}
            </div>

            {/* Pagination */}
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

      {/* Image Popup Dialog */}
      <Dialog open={!!viewingImage} onOpenChange={(open) => !open && setViewingImage(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] p-1 sm:p-6 border-none shadow-none bg-transparent">
          <DialogHeader className="sm:mb-2">
            <DialogTitle className="text-center text-white">{viewingImage?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center overflow-auto">
            {viewingImage && !imageErrors[viewingImage.id] ? (
              <img 
                src={viewingImage.image} 
                alt={viewingImage.name} 
                className="max-w-full max-h-[80vh] object-contain"
                onError={() => handleImageError(viewingImage.id)}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-64 text-gray-400 bg-gray-100 rounded">
                Image Not Available
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
    </div>
  );
};

export default Home;
