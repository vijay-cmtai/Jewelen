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
  const { userInfo } = useSelector((state: RootState) => state.user);

  const addToCart = useCallback(
    async (productId: string, quantity: number = 1) => {
      if (!userInfo || !userInfo.token) {
        alert("Please login first to add items to cart!");
        return;
      }
      
      try {
        await dispatch(addToCartAction({ productId, quantity })).unwrap();
        alert("Product added to cart!");
      } catch (error: any) {
        console.error("Add to cart error:", error);
        alert(error || "Failed to add to cart. Please try again.");
      }
    },
    [dispatch, userInfo]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      if (!userInfo || !userInfo.token) {
        alert("Please login first!");
        return;
      }
      
      try {
        await dispatch(removeFromCartAction({ productId })).unwrap();
      } catch (error: any) {
        console.error("Remove from cart error:", error);
        alert(error || "Failed to remove from cart.");
      }
    },
    [dispatch, userInfo]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (!userInfo || !userInfo.token) {
        alert("Please login first!");
        return;
      }
      
      try {
        if (quantity >= 1) {
          await dispatch(updateCartQuantityAction({ productId, quantity })).unwrap();
        } else {
          await dispatch(removeFromCartAction({ productId })).unwrap();
        }
      } catch (error: any) {
        console.error("Update quantity error:", error);
        alert(error || "Failed to update quantity.");
      }
    },
    [dispatch, userInfo]
  );

  const isItemInWishlist = useCallback(
    (productId: string): boolean => {
      return wishlistIds.includes(productId);
    },
    [wishlistIds]
  );

  const addToWishlist = useCallback(
    async (productId: string) => {
      if (!userInfo || !userInfo.token) {
        alert("Please login first to add items to wishlist!");
        return;
      }

      const productToAdd = allProducts.find((p) => p._id === productId);
      if (!productToAdd) {
        alert("Product not found!");
        return;
      }

      try {
        if (isItemInWishlist(productId)) {
          await dispatch(removeFromWishlistAction({ diamondId: productId })).unwrap();
          alert("Removed from wishlist!");
        } else {
          await dispatch(addToWishlistAction(productToAdd as any)).unwrap();
          alert("Added to wishlist!");
        }
      } catch (error: any) {
        console.error("Wishlist error:", error);
        alert(error || "Failed to update wishlist. Please try again.");
      }
    },
    [dispatch, allProducts, isItemInWishlist, userInfo]
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      if (!userInfo || !userInfo.token) {
        alert("Please login first!");
        return;
      }
      
      try {
        await dispatch(removeFromWishlistAction({ diamondId: productId })).unwrap();
      } catch (error: any) {
        console.error("Remove from wishlist error:", error);
        alert(error || "Failed to remove from wishlist.");
      }
    },
    [dispatch, userInfo]
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
