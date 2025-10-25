import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { RootState } from "@/lib/store";

export interface WishlistAPIItem {
  _id: string;
  name: string;
  sku: string;
  price: number;
  images: string[];
  slug: string;
}

interface WishlistState {
  items: WishlistAPIItem[];
  itemIds: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  itemIds: [],
  status: "idle",
  error: null,
};

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/wishlist`;
const getToken = (state: RootState) => state.user.userInfo?.token;

export const fetchWishlist = createAsyncThunk<
  WishlistAPIItem[],
  void,
  { state: RootState; rejectValue: string }
>("wishlist/fetch", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    if (!token) return [];
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get<WishlistAPIItem[]>(API_URL, config);
    return data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Could not fetch wishlist"
    );
  }
});

export const toggleWishlist = createAsyncThunk<
  WishlistAPIItem[],
  string,
  { state: RootState; rejectValue: string }
>("wishlist/toggle", async (productId, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    if (!token) throw new Error("Not authorized");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.post<WishlistAPIItem[]>(
      `${API_URL}/toggle`,
      { productId },
      config
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Could not toggle wishlist item"
    );
  }
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handleFulfilled = (
      state: WishlistState,
      action: PayloadAction<WishlistAPIItem[]>
    ) => {
      state.status = "succeeded";
      state.items = action.payload;
      state.itemIds = action.payload.map((item) => item._id);
    };

    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishlist.fulfilled, handleFulfilled)
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(toggleWishlist.fulfilled, handleFulfilled);
  },
});

export default wishlistSlice.reducer;
