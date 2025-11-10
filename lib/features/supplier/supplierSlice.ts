// File: lib/features/supplier/supplierSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "@/lib/store";

interface DashboardData {
  totalRevenue: number;
  newOrdersCount: number;
  productsInStock: number;
  salesOverview: { month: string; revenue: number }[];
  bestSellers: { name: string; sales: number; image: string }[];
  recentOrders: {
    _id: string;
    customer: string;
    status: string;
    amount: number;
  }[];
}

interface SupplierState {
  dashboard: DashboardData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SupplierState = {
  dashboard: null,
  status: "idle",
  error: null,
};

// Async Thunk to fetch dashboard data
export const fetchSupplierDashboard = createAsyncThunk<
  DashboardData,
  void,
  { state: RootState; rejectValue: string }
>("supplier/fetchDashboard", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().user.userInfo?.token;
    if (!token) {
      return rejectWithValue("Authentication token not found.");
    }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/supplier/dashboard`,
      config
    );
    return data.data; // Controller se 'data' object return ho raha hai
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch dashboard data"
    );
  }
});

const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupplierDashboard.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSupplierDashboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboard = action.payload;
      })
      .addCase(fetchSupplierDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "An unknown error occurred";
      });
  },
});

export default supplierSlice.reducer;
