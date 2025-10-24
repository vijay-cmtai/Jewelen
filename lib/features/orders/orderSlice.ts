import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

// --- Types ---
interface PopulatedItem {
  _id: string;
  jewelry: {
    _id: string;
    name: string;
    sku: string;
    images: string[];
  };
  priceAtOrder: number;
}

interface OrderItem {
  _id: string;
  name?: string; // Optional for cases where it's not populated initially
  priceAtOrder: number;
  image?: { url: string };
  jewelry?: PopulatedItem["jewelry"];
}

export interface Order {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[] | PopulatedItem[];
  totalAmount: number;
  orderStatus:
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled"
    | "Pending"
    | "Completed"
    | "Failed";
  createdAt: string;
}

interface MyOrdersState {
  data: Order[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  myOrders: MyOrdersState;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  singleStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  listError: string | null;
  singleError: string | null;
  actionError: string | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  myOrders: { data: [], status: "idle", error: null },
  listStatus: "idle",
  singleStatus: "idle",
  actionStatus: "idle",
  listError: null,
  singleError: null,
  actionError: null,
};

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/orders`;

// --- Async Thunks ---

export const fetchMyOrders = createAsyncThunk<
  Order[],
  void,
  { state: RootState }
>("orders/fetchMyOrders", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().user.userInfo?.token;
    if (!token) throw new Error("Not authorized, no token found");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get<{ orders: Order[] }>(
      `${API_URL}/my-orders`,
      config
    );
    return data.orders;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch your orders"
    );
  }
});

export const fetchAllOrders = createAsyncThunk<
  Order[],
  void,
  { state: RootState }
>("orders/fetchAll", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().user.userInfo?.token;
    if (!token) throw new Error("Not authorized");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get<{ orders: Order[] }>(API_URL, config);
    return data.orders;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch orders"
    );
  }
});

export const fetchOrderById = createAsyncThunk<
  Order,
  string,
  { state: RootState }
>("orders/fetchById", async (orderId, { getState, rejectWithValue }) => {
  try {
    const token = getState().user.userInfo?.token;
    if (!token) throw new Error("Not authorized");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get<{ order: Order }>(
      `${API_URL}/${orderId}`,
      config
    );
    return data.order;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch order details"
    );
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
      state.singleStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.myOrders.status = "loading";
      })
      .addCase(
        fetchMyOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.myOrders.status = "succeeded";
          state.myOrders.data = action.payload;
          state.myOrders.error = null;
        }
      )
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.myOrders.status = "failed";
        state.myOrders.error = action.payload as string;
      });

    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(
        fetchAllOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.listStatus = "succeeded";
          state.orders = action.payload;
        }
      )
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      });

    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.singleStatus = "loading";
      })
      .addCase(
        fetchOrderById.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.singleStatus = "succeeded";
          state.selectedOrder = action.payload;
        }
      )
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.singleStatus = "failed";
        state.singleError = action.payload as string;
      });
  },
});

export const { clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
