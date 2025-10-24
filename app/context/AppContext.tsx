"use client";

import { createContext, useContext, ReactNode, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
  updateCartQuantity as updateCartQuantityAction,
} from "@/lib/features/cart/cartSlice";
import {
  addToWishlist as addToWishlistAction,
  removeFromWishlist as removeFromWishlistAction,
} from "@/lib/features/wishlist/wishlistSlice";

interface AppContextType {
  cartItems: any[];
  wishlistItems: string[];
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isItemInWishlist: (productId: string) => boolean;
  clearCart: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { itemIds: wishlistIds } = useSelector(
    (state: RootState) => state.wishlist
  );
  const { items: allProducts } = useSelector(
    (state: RootState) => state.jewelry
  );

  const addToCart = useCallback(
    (productId: string, quantity: number = 1) => {
      dispatch(addToCartAction({ productId, quantity }));
      alert("Product added to cart!");
    },
    [dispatch]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      dispatch(removeFromCartAction({ productId }));
    },
    [dispatch]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity >= 1) {
        dispatch(updateCartQuantityAction({ productId, quantity }));
      } else {
        // Agar quantity 0 ya usse kam ho jaye, toh item ko cart se remove kar do
        dispatch(removeFromCartAction({ productId }));
      }
    },
    [dispatch]
  );

  const isItemInWishlist = useCallback(
    (productId: string): boolean => {
      return wishlistIds.includes(productId);
    },
    [wishlistIds]
  );

  const addToWishlist = useCallback(
    (productId: string) => {
      const productToAdd = allProducts.find((p) => p._id === productId);
      if (productToAdd) {
        if (isItemInWishlist(productId)) {
          dispatch(removeFromWishlistAction({ diamondId: productId }));
          alert("Removed from wishlist!");
        } else {
          dispatch(addToWishlistAction(productToAdd as any));
          alert("Added to wishlist!");
        }
      }
    },
    [dispatch, allProducts, isItemInWishlist]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      dispatch(removeFromWishlistAction({ diamondId: productId }));
    },
    [dispatch]
  );

  const clearCart = useCallback(() => {
    dispatch(clearCartAction());
  }, [dispatch]);

  const value = {
    cartItems,
    wishlistItems: wishlistIds,
    addToCart,
    removeFromCart,
    updateQuantity,
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
