import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface CartItem {
  garmentId: number;
  name: string;
  price: string;
  size: string;
  image: string;
  type: "tops" | "bottoms";
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (garmentId: number, size: string) => void;
  updateQuantity: (garmentId: number, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "dressai-cart";

function parsePrice(price: string): number {
  return parseInt(price.replace(/[^\d]/g, ""), 10) || 0;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems(prev => {
      const existing = prev.find(i => i.garmentId === item.garmentId && i.size === item.size);
      if (existing) {
        return prev.map(i =>
          i.garmentId === item.garmentId && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (garmentId: number, size: string) => {
    setItems(prev => prev.filter(i => !(i.garmentId === garmentId && i.size === size)));
  };

  const updateQuantity = (garmentId: number, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(garmentId, size);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.garmentId === garmentId && i.size === size
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + parsePrice(i.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
