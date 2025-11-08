// File: lib/features/coupons/couponSlice.ts

import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

export interface Coupon {
  _id: string;
  code: string;
  discountType: "Percentage" | "Flat";
  discountValue: number;
  minPurchaseAmount: number;
  isActive: boolean;
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
  createdAt: string;
}

interface CouponState {
  coupons: Coupon[];
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  listError: string | null;
  actionError: string | null;
}

const initialState: CouponState = {
  coupons: [],
  listStatus: "idle",
  actionStatus: "idle",
  listError: null,
  actionError: null,
};

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/coupons`;

export const fetchCoupons = createAsyncThunk<
  Coupon[],
  void,
  { state: RootState }
>("coupons/fetchAll", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().user.userInfo?.token;
    if (!token) return rejectWithValue("Not authorized");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(API_URL, config);
    return data.coupons;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const createCoupon = createAsyncThunk<
  Coupon,
  Omit<Coupon, "_id" | "timesUsed" | "createdAt">,
  { state: RootState }
>("coupons/create", async (couponData, { getState, rejectWithValue }) => {
  try {
    const token = getState().user.userInfo?.token;
    if (!token) return rejectWithValue("Not authorized");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.post(API_URL, couponData, config);
    return data.coupon;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const deleteCoupon = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("coupons/delete", async (id, { getState, rejectWithValue }) => {
  try {
    const token = getState().user.userInfo?.token;
    if (!token) return rejectWithValue("Not authorized");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`${API_URL}/${id}`, config);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

const couponSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(
        fetchCoupons.fulfilled,
        (state, action: PayloadAction<Coupon[]>) => {
          state.listStatus = "succeeded";
          state.coupons = action.payload;
        }
      )
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      })
      .addCase(createCoupon.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(
        createCoupon.fulfilled,
        (state, action: PayloadAction<Coupon>) => {
          state.actionStatus = "succeeded";
          state.coupons.unshift(action.payload);
        }
      )
      .addCase(createCoupon.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      })
      .addCase(deleteCoupon.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(
        deleteCoupon.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.actionStatus = "succeeded";
          state.coupons = state.coupons.filter((c) => c._id !== action.payload);
        }
      )
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      });
  },
});

export const { resetActionStatus } = couponSlice.actions;
export default couponSlice.reducer;
