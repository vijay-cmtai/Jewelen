import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "@/lib/store";
import { removeItemOptimistic } from "../wishlist/wishlistSlice";
import { JewelryItem } from "../jewelry/jewelrySlice";

export interface CartItem extends JewelryItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CartState = {
  items: [],
  status: "idle",
  error: null,
};

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/cart`;
const getToken = (state: RootState) => state.user.userInfo?.token;

export const fetchCart = createAsyncThunk<
  CartItem[],
  void,
  { state: RootState }
>("cart/fetchCart", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    if (!token) return [];
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(API_URL, config);
    return data.items || [];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Could not fetch cart"
    );
  }
});

export const addToCart = createAsyncThunk<
  CartItem,
  { productId: string; quantity: number },
  { state: RootState }
>(
  "cart/addToCart",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState());
      if (!token) throw new Error("Not authorized");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(
        `${API_URL}/add`,
        { productId, quantity },
        config
      );
      return data.item;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Could not add to cart"
      );
    }
  }
);

// --- YEH NAYA ASYNC THUNK ADD KIYA GAYA HAI ---
export const updateCartQuantity = createAsyncThunk<
  CartItem,
  { productId: string; quantity: number },
  { state: RootState }
>(
  "cart/updateQuantity",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState());
      if (!token) throw new Error("Not authorized");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(
        `${API_URL}/update-quantity`,
        { productId, quantity },
        config
      );
      return data.item;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Could not update quantity"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk<
  string,
  { productId: string },
  { state: RootState }
>(
  "cart/removeFromCart",
  async ({ productId }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState());
      if (!token) throw new Error("Not authorized");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/remove/${productId}`, config);
      return productId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Could not remove from cart"
      );
    }
  }
);

export const moveFromWishlistToCart = createAsyncThunk<
  void,
  { productId: string },
  { state: RootState; dispatch: AppDispatch }
>(
  "cart/moveFromWishlistToCart",
  async ({ productId }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getToken(getState());
      if (!token) throw new Error("Not authorized");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${API_URL}/move-from-wishlist`, { productId }, config);
      dispatch(removeItemOptimistic(productId));
      dispatch(fetchCart());
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Could not move item"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCart.fulfilled,
        (state, action: PayloadAction<CartItem[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(
        addToCart.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          const existingItem = state.items.find(
            (item) => item._id === action.payload._id
          );
          if (existingItem) {
            existingItem.quantity = action.payload.quantity;
          } else {
            state.items.push(action.payload);
          }
        }
      )
      // --- YEH NAYA CASE ADD KIYA GAYA HAI ---
      .addCase(
        updateCartQuantity.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          const itemIndex = state.items.findIndex(
            (item) => item._id === action.payload._id
          );
          if (itemIndex !== -1) {
            state.items[itemIndex] = action.payload;
          }
        }
      )
      .addCase(
        removeFromCart.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter(
            (item) => item._id !== action.payload
          );
        }
      );
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
