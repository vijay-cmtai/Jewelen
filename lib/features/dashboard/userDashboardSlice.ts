import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import type { Order } from "@/lib/features/orders/orderSlice";

interface UserDashboardStats {
  totalSpent: number;
  ordersPlaced: number;
  wishlistItems: number;
  recentOrder: Order | null;
}

interface UserDashboardState {
  stats: UserDashboardStats | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserDashboardState = {
  stats: null,
  status: "idle",
  error: null,
};

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/user-dashboard`;

export const fetchUserDashboardStats = createAsyncThunk<
  UserDashboardStats,
  void,
  { state: RootState }
>("userDashboard/fetchStats", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().user.userInfo?.token;
    if (!token) throw new Error("Not authorized");

    const config = { headers: { Authorization: `Bearer ${token}` } };
    // Ab URL sahi se banega: .../api/user-dashboard/stats
    const { data } = await axios.get<{ stats: UserDashboardStats }>(
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

const userDashboardSlice = createSlice({
  name: "userDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDashboardStats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchUserDashboardStats.fulfilled,
        (state, action: PayloadAction<UserDashboardStats>) => {
          state.status = "succeeded";
          state.stats = action.payload;
        }
      )
      .addCase(fetchUserDashboardStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default userDashboardSlice.reducer;
