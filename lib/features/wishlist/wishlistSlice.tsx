import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
// Types
export interface WishlistItem {
  _id: string;
  stockId: string;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  price: number;
  imageLink?: string;
}
interface WishlistState {
  items: WishlistItem[];
  itemIds: string[];
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
const initialState: WishlistState = {
  items: [],
  itemIds: [],
  listStatus: "idle",
  actionStatus: "idle",
  error: null,
};
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/wishlist`;
export const fetchWishlist = createAsyncThunk<
  WishlistItem[],
  void,
  { state: RootState }
>("wishlist/fetchWishlist", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().user.userInfo?.token;
    if (!token) throw new Error("Not authorized");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get<WishlistItem[]>(API_URL, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Could not fetch wishlist"
    );
  }
});
export const addToWishlist = createAsyncThunk<
  WishlistItem,
  WishlistItem,
  { state: RootState }
>(
  "wishlist/addToWishlist",
  async (itemToAdd, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.userInfo?.token;
      if (!token) throw new Error("Not authorized");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${API_URL}/add`, { diamondId: itemToAdd._id }, config);
      return itemToAdd;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Could not add to wishlist"
      );
    }
  }
);
export const removeFromWishlist = createAsyncThunk<
  string,
  { diamondId: string },
  { state: RootState }
>(
  "wishlist/removeFromWishlist",
  async ({ diamondId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.userInfo?.token;
      if (!token) throw new Error("Not authorized");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/remove/${diamondId}`, config);
      return diamondId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Could not remove from wishlist"
      );
    }
  }
);
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlistStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
    removeItemOptimistic: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      state.itemIds = state.itemIds.filter((id) => id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.items = action.payload;
        state.itemIds = action.payload.map((item) => item._id);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload as string;
      });
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.items.push(action.payload);
        state.itemIds.push(action.payload._id);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      });
    builder
      .addCase(removeFromWishlist.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.itemIds = state.itemIds.filter((id) => id !== action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetWishlistStatus, removeItemOptimistic } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
