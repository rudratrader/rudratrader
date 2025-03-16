import { useState } from "react";
import { Search, ShoppingCart, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EnhancedProduct,Category,SubCategory,FilterState,Brand } from "@/config/types";
import FiltersSidebar from "@/components/FiltersSidebar";
import CartDrawer from '@/components/CartDrawer';

interface CartItem {
  product: EnhancedProduct;
  quantity: number;
}

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartItemsCount: number;
  cartItems: CartItem[];
  isCartOpen: boolean;
  onCartToggle: () => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  // Filter related props
  categories: Category[];
  subCategories: SubCategory[];
  brands: Brand[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const Navbar = ({
  searchQuery,
  onSearchChange,
  cartItemsCount,
  cartItems,
  isCartOpen,
  onCartToggle,
  onRemoveFromCart,
  onUpdateQuantity,
  // Filter related props
  categories,
  subCategories,
  brands,
  filters,
  onFilterChange,
}: NavbarProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Check if any filter is applied (for showing the indicator)
  const hasActiveFilters = !!(filters.categoryId || filters.subCategoryId || filters.brandId || filters.sortBy);

  const handleCheckout = () => {
    // Calculate cart total
    const cartTotal = cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity, 
      0
    );
    
    const formattedTotal = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(cartTotal);

    // Format each cart item into a message line
    const message = cartItems
      .map(
        (item) =>
          `${item.quantity} × ₹${item.product.price} = ₹${
            item.quantity * Number(item.product.price)
          } - ${item.product.name}`
      )
      .join("\n");
    
    // Create WhatsApp URL with order details
    const url = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
      "Order Details:\n" + message + `\n\nTotal: ${formattedTotal}`
    )}`;
    
    // Redirect to WhatsApp
    window.open(url, "_blank");
  };

  return (
    <>
      {/* Fixed navbar */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        {/* Top bar with company name */}
        <div className="container mx-auto px-4 lg:pb-3 pt-3 flex justify-between items-center">
          {/* Company name - centered on mobile, left-aligned on desktop */}
          <div className="flex-1 flex pt-2 pb-0 justify-center md:justify-start">
            <a 
                href="/"
                onClick={(e) => { 
                  e.preventDefault(); 
                  window.location.href = window.location.origin;
                }}
                className="cursor-pointer hover:opacity-90 transition-opacity"
              >
              <h1 className="text-2xl font-bold text-primary">Rudra Trader</h1>
            </a>
          </div>
                    
          {/* Desktop search and filters */}
          <div className="hidden md:flex items-center flex-1 justify-center gap-2">
            <div className="relative w-full max-w-md">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pr-8"
              />
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            {/* Desktop filter button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsFilterOpen(true)}
              className="relative whitespace-nowrap"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
              {hasActiveFilters && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs">
                  !
                </Badge>
              )}
            </Button>
          </div>
          
          {/* Desktop cart button */}
          <div className="hidden flex-1 md:flex justify-end">
            <Button variant="outline" size="sm" onClick={onCartToggle} className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile bottom bar with filters, search, cart */}
        <div className="md:hidden container mx-auto px-4 flex justify-between items-center">
          {/* Filters button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsFilterOpen(true)}
            className="flex flex-col items-center text-xs px-2 relative"
          >
            <Filter className="h-5 w-5 mb-1" />
            <span>Filters</span>
            {hasActiveFilters && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
                !
              </Badge>
            )}
          </Button>

          <div className={cn(
            "md:hidden container mx-auto px-4 py-2 transition-all duration-300 max-h-16 opacity-100",
          )}>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pr-8"
              />
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {/* Cart button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCartToggle}
            className="flex flex-col items-center text-xs px-2 relative"
          >
            <ShoppingCart className="h-5 w-5 mb-1" />
            <span>Cart</span>
            {cartItemsCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
                {cartItemsCount}
              </Badge>
            )}
          </Button>
        </div>
      </header>
      
      {/* Use the existing FiltersSidebar component */}
      <FiltersSidebar
        categories={categories}
        subCategories={subCategories}
        brands={brands}
        filters={filters}
        onFilterChange={(newFilters) => {
          onFilterChange(newFilters);
          // Close filter dialog after applying filters
          setIsFilterOpen(false);
        }}
        isOpen={isFilterOpen} 
        onToggle={() => setIsFilterOpen(!isFilterOpen)}
        forceDialog={true} // Add this prop to force dialog mode on all screen sizes
      />
      
      {/* Use the new CartDrawer component */}
      <CartDrawer 
        isOpen={isCartOpen}
        onToggle={onCartToggle}
        cartItems={cartItems}
        cartItemsCount={cartItemsCount}
        onRemoveFromCart={onRemoveFromCart}
        onUpdateQuantity={onUpdateQuantity}
        handleCheckout={handleCheckout}
      />
    </>
  );
};

export default Navbar;