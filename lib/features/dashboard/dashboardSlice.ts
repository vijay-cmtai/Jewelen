import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

// Types for dashboard data
interface RecentOrder {
  _id: string;
  userId: { name: string };
  totalAmount: number;
}

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeBuyers: number;
  activeSuppliers: number;
  totalProducts: number;
  recentOrders: RecentOrder[];
}

interface DashboardState {
  stats: DashboardStats | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  status: "idle",
  error: null,
};

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/dashboard`;

// Async Thunk to fetch stats
export const fetchDashboardStats = createAsyncThunk<
  DashboardStats,
  void,
  { state: RootState }
>("dashboard/fetchStats", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().user.userInfo?.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get<{ stats: DashboardStats }>(
      `${API_URL}/stats`,
      config
    );
    return data.stats;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch dashboard stats"
    );
  }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchDashboardStats.fulfilled,
        (state, action: PayloadAction<DashboardStats>) => {
          state.status = "succeeded";
          state.stats = action.payload;
        }
      )
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
