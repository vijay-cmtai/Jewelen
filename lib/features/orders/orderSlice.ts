// lib/features/orders/orderSlice.ts

import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

// Interfaces (assuming they are correct as provided)
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
  name?: string;
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
  shippingAddress: any; // Add shippingAddress to the Order interface for type safety
  paymentInfo: any; // Add paymentInfo as well
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

// ✅ createOrder THUNK (FIXED)
export const createOrder = createAsyncThunk<
  { order: Order; razorpayOrder: any; razorpayKeyId: string },
  // <-- FIX 1: Add totalAmount to the type definition
  { addressId: string; items: any[]; totalAmount: number },
  { state: RootState; rejectValue: string }
>(
  "orders/create",
  // <-- FIX 2: Destructure totalAmount from the arguments
  async ({ addressId, items, totalAmount }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.userInfo?.token;
      if (!token) return rejectWithValue("Not authorized");

      const config = { headers: { Authorization: `Bearer ${token}` } };

      // <-- FIX 3: Send totalAmount in the request body
      const { data } = await axios.post(
        API_URL,
        { addressId, items, totalAmount }, // Pass all three fields
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order"
      );
    }
  }
);

// ... (other thunks remain the same) ...
export const verifyPayment = createAsyncThunk<
  { orderId: string },
  {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  },
  { state: RootState; rejectValue: string }
>(
  "orders/verifyPayment",
  async (paymentData, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.userInfo?.token;
      if (!token) return rejectWithValue("Not authorized");

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(
        `${API_URL}/verify-payment`,
        paymentData,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Payment verification failed"
      );
    }
  }
);

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
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.actionStatus = "succeeded";
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      });
    builder
      .addCase(verifyPayment.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.actionStatus = "succeeded";
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      });
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

export const { clearSelectedOrder, resetActionStatus } = orderSlice.actions;
export default orderSlice.reducer;
