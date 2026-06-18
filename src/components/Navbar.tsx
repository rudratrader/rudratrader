import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Category, SubCategory, FilterState, Brand } from "@/config/types";
import FiltersSidebar from "@/components/FiltersSidebar";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/context/CartContext";

interface NavbarProps {
  // Search + filters (omitted on the slim/detail header)
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  categories?: Category[];
  subCategories?: SubCategory[];
  brands?: Brand[];
  filters?: FilterState;
  onFilterChange?: (filters: FilterState) => void;
}

const Navbar = ({
  searchQuery = "",
  onSearchChange,
  categories = [],
  subCategories = [],
  brands = [],
  filters,
  onFilterChange,
}: NavbarProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { cartItems, cartCount, removeFromCart, updateQuantity, clearCart } = useCart();

  // Full (home) header shows search + filters; otherwise we render a slim header.
  const hasControls = !!(onFilterChange && filters && onSearchChange);
  const hasActiveFilters = !!(
    filters && (filters.categoryId || filters.subCategoryId || filters.brandId || filters.sortBy)
  );

  const handleCheckout = () => {
    const cartTotal = cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

    const formattedTotal = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(cartTotal);

    const message = cartItems
      .map(
        (item) =>
          `${item.quantity} × ₹${item.product.price} = ₹${
            item.quantity * Number(item.product.price)
          } - ${item.product.name}`
      )
      .join("\n");

    const url = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
      "Order Details:\n" + message + `\n\nTotal: ${formattedTotal}`
    )}`;

    window.open(url, "_blank");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-[#fbf9f5] shadow-sm z-50">
        {hasControls ? (
          <>
            {/* Top bar with company name */}
            <div className="container mx-auto px-4 lg:pb-3 pt-3 flex justify-between items-center">
              {/* Company name - centered on mobile, left-aligned on desktop */}
              <div className="flex-1 flex pt-2 pb-0 justify-center md:justify-start">
                <Link to="/" className="cursor-pointer hover:opacity-90 transition-opacity">
                  <h1 className="text-2xl font-bold text-primary">Rudra Trader</h1>
                </Link>
              </div>

              {/* Desktop search and filters */}
              <div className="hidden md:flex items-center flex-1 justify-center gap-2">
                <div className="relative w-full max-w-md">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="pr-8"
                  />
                  <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen(true)}
                  className="relative whitespace-nowrap bg-[#fbf9f5]"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Filters
                  {hasActiveFilters && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs"
                    >
                      !
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Desktop cart button */}
              <div className="hidden flex-1 md:flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCartOpen(true)}
                  className="relative bg-[#fbf9f5]"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            {/* Mobile bottom bar with filters, search, cart */}
            <div className="md:hidden container mx-auto px-4 flex justify-between items-center bg-[#fbf9f5]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFilterOpen(true)}
                className="flex flex-col items-center text-xs px-2 relative bg-[#fbf9f5]"
              >
                <Filter className="h-5 w-5 mb-1" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
                  >
                    !
                  </Badge>
                )}
              </Button>

              <div className="md:hidden container mx-auto px-4 py-2 transition-all duration-300 max-h-16 opacity-100">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="pr-8"
                  />
                  <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="flex flex-col items-center text-xs px-2 relative"
              >
                <ShoppingCart className="h-5 w-5 mb-1" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </div>
          </>
        ) : (
          /* Slim header for the product detail page */
          <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-2">
            {/* Empty spacer keeps the logo centered against the cart on the right */}
            <div className="flex-1" />

            <div className="flex-1 flex justify-center">
              <Link to="/" className="cursor-pointer hover:opacity-90 transition-opacity">
                <h1 className="text-xl sm:text-2xl font-bold text-primary whitespace-nowrap">
                  Rudra Trader
                </h1>
              </Link>
            </div>

            <div className="flex-1 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative bg-[#fbf9f5]"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Filters dialog (home only) */}
      {hasControls && filters && onFilterChange && (
        <FiltersSidebar
          categories={categories}
          subCategories={subCategories}
          brands={brands}
          filters={filters}
          onFilterChange={(newFilters) => {
            onFilterChange(newFilters);
            setIsFilterOpen(false);
          }}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
          forceDialog={true}
        />
      )}

      {/* Cart drawer (available on every page) */}
      <CartDrawer
        isOpen={isCartOpen}
        onToggle={() => setIsCartOpen((open) => !open)}
        cartItems={cartItems}
        cartItemsCount={cartCount}
        onRemoveFromCart={removeFromCart}
        onUpdateQuantity={updateQuantity}
        handleCheckout={handleCheckout}
        handleClearCart={clearCart}
      />
    </>
  );
};

export default Navbar;
