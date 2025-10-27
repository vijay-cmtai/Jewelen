import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { RootState } from "@/lib/store";
import { JewelryItem } from "../jewelry/jewelrySlice";

// Ab humein local JewelryItem ki zaroorat nahi hai, use hata dein.

export interface CartAPIItem {
  jewelry: JewelryItem; // Ab yeh poori definition istemal karega
  quantity: number;
  _id: string;
}

interface CartState {
  items: CartAPIItem[];
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

// ... baaki ke sabhi async thunks (fetchCart, addToCart, etc.) waise hi rahenge ...
export const fetchCart = createAsyncThunk<
  CartAPIItem[],
  void,
  { state: RootState; rejectValue: string }
>("cart/fetch", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    if (!token) return [];
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get<CartAPIItem[]>(API_URL, config);
    return data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Could not fetch cart"
    );
  }
});

export const addToCart = createAsyncThunk<
  CartAPIItem[],
  { productId: string; quantity: number },
  { state: RootState; rejectValue: string }
>(
  "cart/add",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState());
      if (!token) throw new Error("Not authorized");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post<CartAPIItem[]>(
        `${API_URL}/add`,
        { productId, quantity },
        config
      );
      return data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Could not add to cart"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk<
  CartAPIItem[],
  string,
  { state: RootState; rejectValue: string }
>("cart/remove", async (productId, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    if (!token) throw new Error("Not authorized");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.delete<CartAPIItem[]>(
      `${API_URL}/remove/${productId}`,
      config
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Could not remove from cart"
    );
  }
});

export const updateCartQuantity = createAsyncThunk<
  CartAPIItem[],
  { productId: string; quantity: number },
  { state: RootState; rejectValue: string }
>(
  "cart/update",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState());
      if (!token) throw new Error("Not authorized");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put<CartAPIItem[]>(
        `${API_URL}/update/${productId}`,
        { quantity },
        config
      );
      return data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Could not update quantity"
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
    const handlePending = (state: CartState) => {
      state.status = "loading";
    };
    const handleFulfilled = (
      state: CartState,
      action: PayloadAction<CartAPIItem[]>
    ) => {
      state.status = "succeeded";
      state.items = action.payload;
    };
    const handleRejected = (
      state: CartState,
      action: PayloadAction<string | undefined>
    ) => {
      state.status = "failed";
      state.error = action.payload || "An unknown error occurred";
    };

    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/pending"),
        handlePending
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/fulfilled"),
        handleFulfilled
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/rejected"),
        handleRejected
      );
  },
});

export const { clearCart: clearCartAction } = cartSlice.actions;
export default cartSlice.reducer;
