"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/lib/products"; 
interface CartItem {
  productId: string;
  quantity: number;
}

interface AppContextType {
  cartItems: CartItem[];
  wishlistItems: string[]; 
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  addToWishlist: (productId: string) => void; 
  removeFromWishlist: (productId: string) => void;
  isItemInWishlist: (productId: string) => boolean;
  clearCart: () => void; 
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  const addToCart = (productId: string, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.productId === productId
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { productId, quantity }];
    });
    alert("Product added to cart!");
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
  };

  const addToWishlist = (productId: string) => {
    setWishlistItems((prev) => {
      if (prev.includes(productId)) {
        alert("Removed from wishlist!");
        return prev.filter((id) => id !== productId);
      } else {
        alert("Added to wishlist!");
        return [...prev, productId];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((prev) => prev.filter((id) => id !== productId));
  };

  const isItemInWishlist = (productId: string): boolean => {
    return wishlistItems.includes(productId);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    isItemInWishlist,
    clearCart, 
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
