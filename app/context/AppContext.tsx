"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  fetchCart,
  addToCart as addToCartThunk,
  removeFromCart as removeFromCartThunk,
  updateCartQuantity as updateCartQuantityThunk,
  clearCartAction,
} from "@/lib/features/cart/cartSlice";
import {
  fetchWishlist,
  toggleWishlist as toggleWishlistThunk,
} from "@/lib/features/wishlist/wishlistSlice";
import { toast } from "react-toastify";

interface MappedCartItem {
  _id: string;
  name: string;
  price: number;
  images: string[];
  slug: string;
  quantity: number;
}

interface AppContextType {
  cartItems: MappedCartItem[];
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
  const dispatch = useAppDispatch();

  const { userInfo } = useAppSelector((state) => state.user);
  const { items: cartData } = useAppSelector((state) => state.cart);
  const { itemIds: wishlistItems } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [userInfo, dispatch]);

  // ✅ FIX: Humne `(cartData || [])` add kiya hai.
  // Isse agar `cartData` null ya undefined hai, to code crash hone ke bajaye ek khali array [] use karega.
  const cartItems: MappedCartItem[] = (cartData || [])
    .filter((item) => item && item.jewelry)
    .map((item) => ({
      ...item.jewelry,
      quantity: item.quantity,
    }));

  const addToCart = useCallback(
    (productId: string, quantity: number = 1) => {
      if (!userInfo) {
        toast.error("Please login to add items to your cart.");
        return;
      }
      dispatch(addToCartThunk({ productId, quantity }));
      toast.success("Item added to cart!");
    },
    [dispatch, userInfo]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      if (!userInfo) return;
      dispatch(removeFromCartThunk(productId));
    },
    [dispatch, userInfo]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (!userInfo) return;
      dispatch(updateCartQuantityThunk({ productId, quantity }));
    },
    [dispatch, userInfo]
  );

  const addToWishlist = useCallback(
    (productId: string) => {
      if (!userInfo) {
        toast.error("Please login to manage your wishlist.");
        return;
      }
      dispatch(toggleWishlistThunk(productId));
    },
    [dispatch, userInfo]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      if (!userInfo) return;
      dispatch(toggleWishlistThunk(productId));
    },
    [dispatch, userInfo]
  );

  const isItemInWishlist = useCallback(
    (productId: string): boolean => {
      // ✅ FIX: Wishlist ke liye bhi safety check add kar diya hai
      return (wishlistItems || []).includes(productId);
    },
    [wishlistItems]
  );

  const clearCart = useCallback(() => {
    dispatch(clearCartAction());
  }, [dispatch]);

  const value: AppContextType = {
    cartItems,
    wishlistItems: wishlistItems || [], // ✅ Yahan bhi safety check
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
