import MobileLayout from "@/components/layout/MobileLayout";
import { useCart } from "@/lib/cartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Check } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { toast } = useToast();

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
    toast({
      title: "Order placed successfully!",
      description: "Your order has been confirmed. Thank you for shopping!",
    });
  };

  if (orderPlaced) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold mb-2" data-testid="text-order-success">Order Confirmed!</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Your order has been placed successfully. You will receive a confirmation shortly.
          </p>
          <Link href="/try-on">
            <Button data-testid="button-continue-shopping">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </MobileLayout>
    );
  }

  if (items.length === 0) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <ShoppingBag size={28} className="text-muted-foreground" />
          </div>
          <h2 className="text-lg font-bold mb-1" data-testid="text-empty-cart">Your cart is empty</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Try on some outfits and add your favorites to cart!
          </p>
          <Link href="/try-on">
            <Button data-testid="button-start-shopping">
              Start Shopping
            </Button>
          </Link>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/try-on">
            <button className="p-1" data-testid="button-back-from-cart">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <h1 className="text-lg font-bold" data-testid="text-cart-title">
            Shopping Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
          </h1>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={`${item.garmentId}-${item.size}`}
              className="flex gap-3 bg-card rounded-xl p-3 border border-border/50"
              data-testid={`card-cart-item-${item.garmentId}-${item.size}`}
            >
              <div className="w-20 h-24 rounded-lg overflow-hidden bg-muted/30 shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain"
                  data-testid={`img-cart-item-${item.garmentId}-${item.size}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate" data-testid={`text-cart-item-name-${item.garmentId}-${item.size}`}>
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Size: {item.size} · {item.type === "tops" ? "Top" : "Bottom"}
                </p>
                <p className="text-sm font-bold text-primary mt-1" data-testid={`text-cart-item-price-${item.garmentId}-${item.size}`}>
                  {item.price}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.garmentId, item.size, item.quantity - 1)}
                      data-testid={`button-decrease-${item.garmentId}-${item.size}`}
                    >
                      <Minus size={14} />
                    </Button>
                    <span className="text-sm font-semibold w-6 text-center" data-testid={`text-quantity-${item.garmentId}-${item.size}`}>
                      {item.quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.garmentId, item.size, item.quantity + 1)}
                      data-testid={`button-increase-${item.garmentId}-${item.size}`}
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeItem(item.garmentId, item.size)}
                    data-testid={`button-remove-${item.garmentId}-${item.size}`}
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-16 bg-background border-t border-border/50 px-4 py-3 mt-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Total ({totalItems} items)</p>
            <p className="text-xl font-bold" data-testid="text-cart-total">
              ₹{totalPrice.toLocaleString("en-IN")}
            </p>
          </div>
          <Button
            onClick={handlePlaceOrder}
            className="px-8"
            data-testid="button-place-order"
          >
            <ShoppingBag size={16} className="mr-2" />
            Place Order
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center">
          Free delivery on orders above ₹999
        </p>
      </div>
    </MobileLayout>
  );
}
