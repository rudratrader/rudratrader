import { ShoppingCart, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { EnhancedProduct } from "@/config/types";

interface CartItem {
  product: EnhancedProduct;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  cartItems: CartItem[];
  cartItemsCount: number;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  handleCheckout: () => void;
}

const CartDrawer = ({
  isOpen,
  onToggle,
  cartItems,
  cartItemsCount,
  onRemoveFromCart,
  onUpdateQuantity,
  handleCheckout,
}: CartDrawerProps) => {
  
  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity, 
    0
  );
  
  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(cartTotal);

  return (
    <Sheet open={isOpen} onOpenChange={onToggle}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart ({cartItemsCount} items)</SheetTitle>
        </SheetHeader>
        
        {cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center flex-col gap-4 my-8 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-300" />
            <p>Your cart is empty</p>
            <Button variant="outline" size="sm" onClick={onToggle}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto -mr-4 pr-4 py-4">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-3 border-b pb-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={(() => {
                          try {
                            const images = JSON.parse(item.product.image);
                            return Array.isArray(images) ? images[0] : images;
                          } catch {
                            return item.product.image;
                          }
                        })()} 
                        alt={item.product.name} 
                        className="object-contain w-full h-full" 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm break-words overflow-wrap-break-word whitespace-normal">{item.quantity} × {item.product.name}</p>
                      <p className="text-gray-500 text-xs break-words overflow-wrap-break-word whitespace-normal">{item.product.categoryName}</p>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border rounded-md">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2" 
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="px-2 text-sm">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2" 
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveFromCart(item.product.id)}
                          className="h-7 px-2 text-red-500 hover:text-red-500 " 
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      <p className="text-sm font-medium mt-1">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR'
                        }).format(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <SheetFooter className="border-t pt-4">
              <div className="w-full space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-lg">{formattedTotal}</span>
                </div>
                <Button className="w-full bg-[#624d15] hover:bg-amber-800" onClick={handleCheckout}>
                  <span>Checkout</span>
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;