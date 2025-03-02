import { useState, useEffect } from "react";
import { ShoppingCart, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "../config";

interface Props {
  cart: { [key: string]: number };
  products: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
  checkout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Navbar: React.FC<Props> = ({
  cart,
  products,
  addToCart,
  removeFromCart,
  checkout,
  searchQuery,
  setSearchQuery,
}) => {
  const [open, setOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearch = () => {
    setSearchQuery(localSearch);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const cartItems = Object.keys(cart).map((id) => {
    const product = products.find((p) => p.id === id);
    return product ? {
      ...product,
      quantity: cart[id],
    } : {
      id: id,
      name: "Unknown Product",
      category: "",
      price: 0,
      image: "",
      quantity: cart[id]
    };
  });

  const totalAmount = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
  
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md p-1 sm:p-2 fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between w-full gap-1 sm:gap-2">
        {/* Brand Name (Left) */}
        <div className="flex-shrink-0">
          <a href="/" className="cursor-pointer no-underline">
            <span className="text-xs sm:text-sm md:text-2xl font-bold truncate max-w-[50px] sm:max-w-[100px] md:max-w-none text-black">
              Rudra Trader
            </span>
          </a>
        </div>
        {/* Search Bar (Middle) */}
        <div className="flex-1 flex justify-center w-[30%] xs:w-[40%] sm:w-[50%] md:w-[60%] lg:w-[70%] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          <div className="w-full flex items-center border rounded-md px-1 xs:px-1.5 sm:px-2 md:px-3 py-0 bg-gray-100">
            <Input
              type="text"
              placeholder="Search..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full border-none focus:ring-0 bg-transparent text-xs sm:text-sm h-6"
            />
            <button
              onClick={handleSearch}
              className="p-0.5 rounded-md hover:bg-gray-200"
            >
              <Search size={10} className="xs:size-[12px] sm:size-[14px] text-gray-700" />
            </button>
          </div>
        </div>


        {/* Cart Button (Right) */}
        <div className="flex-shrink-0">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="cart"
                className="relative p-1 sm:p-2 rounded-md hover:bg-gray-200"
              >
                <ShoppingCart size={30} className="sm:size={20} text-gray-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs sm:text-sm font-bold 
                  flex items-center justify-center rounded-full min-w-[16px] min-h-[16px] sm:min-w-[18px] sm:min-h-[18px] px-1">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </SheetTrigger>

            {/* Cart Drawer */}
            <SheetContent
              side="right"
              className="p-2 sm:p-4 w-full max-w-sm bg-white shadow-lg max-h-screen flex flex-col"
            >
              <h2 className="text-xl sm:text-2xl font-bold">Your Cart</h2>
              {cartItems.length === 0 ? (
                <p className="mt-2 text-sm sm:text-base">Your cart is empty.</p>
              ) : (
                <>
                  <div className="mt-2 sm:mt-3 flex-1 overflow-y-auto space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center gap-1 border-b pb-2 text-base sm:text-base">
                        <span className="max-w-24 sm:max-w-32">{item.quantity} × {item.name}</span>
                        <div className="flex items-center shrink-0">
                          <Button size="sm" variant="outline" className="h-6 w-6 p-0 text-base sm:h-7 sm:w-7" onClick={() => removeFromCart(item)}>-</Button>
                          <span className="mx-1.5 sm:mx-2">{item.quantity}</span>
                          <Button size="sm" variant="outline" className="h-6 w-6 p-0 text-base sm:h-7 sm:w-7" onClick={() => addToCart(item)}>+</Button>
                          <span className="ml-2 sm:ml-3 font-bold">₹{item.quantity * (Number(item.price) || 0)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Fixed Checkout Section */}
                  <div className="mt-3 sm:mt-4">
                    <div className="text-base sm:text-xl font-bold">Total: ₹{totalAmount}</div>
                    <Button size="default" className="mt-2 sm:mt-3 w-full py-1.5 sm:py-2 text-base sm:text-base bg-yellow-400 hover:bg-yellow-300" onClick={checkout}>
                      Checkout
                    </Button>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
