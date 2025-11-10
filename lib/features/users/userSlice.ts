import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import type { RootState } from "@/lib/store";

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "User" | "Supplier";
  status: "Pending" | "Approved" | "Rejected";
  createdAt?: string;
  token?: string;
  companyName?: string;
  tradingName?: string;
  businessType?: string;
  companyCountry?: string;
  corporateIdentityNumber?: string;
  companyWebsite?: string;
  companyAddress?: string;
  profilePicture?: {
    public_id: string;
    url: string;
  };
}

interface UserState {
  userInfo: UserInfo | null;
  users: UserInfo[];
  selectedUser: UserInfo | null;
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  singleStatus: "idle" | "loading" | "succeeded" | "failed";
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  singleError: string | null;
  listError: string | null;
  actionError: string | null;
}

const getUserInfoFromCookie = (): UserInfo | null => {
  const userInfoJSON = Cookies.get("userInfo");
  try {
    return userInfoJSON ? JSON.parse(userInfoJSON) : null;
  } catch (error) {
    console.error("Error parsing userInfo from cookie:", error);
    Cookies.remove("userInfo");
    return null;
  }
};

const initialState: UserState = {
  userInfo: getUserInfoFromCookie(),
  users: [],
  selectedUser: null,
  actionStatus: "idle",
  singleStatus: "idle",
  listStatus: "idle",
  error: null,
  singleError: null,
  listError: null,
  actionError: null,
};

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export const registerUser = createAsyncThunk<
  { success: boolean; message: string },
  FormData,
  { rejectValue: string }
>("user/register", async (userData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<{ success: boolean; message: string }>(
      `${API_URL}/register`,
      userData
    );
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Registration failed"
    );
  }
});

export const verifyOtp = createAsyncThunk<
  UserInfo & { message?: string },
  { email: string; otp: string },
  { rejectValue: string }
>("user/verifyOtp", async (otpData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<UserInfo & { message?: string }>(
      `${API_URL}/verify-otp`,
      otpData
    );
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "OTP verification failed"
    );
  }
});

export const loginUser = createAsyncThunk<
  UserInfo,
  { email: string; password: string },
  { rejectValue: string }
>("user/login", async (loginData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<UserInfo>(`${API_URL}/login`, loginData);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const forgotPassword = createAsyncThunk<
  { success: boolean; message: string },
  { email: string },
  { rejectValue: string }
>("user/forgotPassword", async ({ email }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/forgot-password`, { email });
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to send reset link."
    );
  }
});

export const resetPassword = createAsyncThunk<
  { success: boolean; message: string; token?: string },
  { token: string; password: string },
  { rejectValue: string }
>("user/resetPassword", async ({ token, password }, { rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${API_URL}/reset-password/${token}`, {
      password,
    });
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to reset password."
    );
  }
});

export const fetchAllUsers = createAsyncThunk<
  UserInfo[],
  void,
  { state: RootState; rejectValue: string }
>("user/fetchAll", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().user.userInfo?.token;
    if (!token) {
      return rejectWithValue("Not authorized, no token");
    }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get<UserInfo[]>(`${API_URL}/all`, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Could not fetch users."
    );
  }
});

export const fetchUserById = createAsyncThunk<
  UserInfo,
  string,
  { state: RootState }
>("user/fetchById", async (userId, { getState, rejectWithValue }) => {
  try {
    const token = getState().user.userInfo?.token;
    if (!token) return rejectWithValue("Not authorized");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get<UserInfo>(`${API_URL}/${userId}`, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const updateUserStatus = createAsyncThunk<
  UserInfo,
  { userId: string; status: "Approved" | "Rejected" },
  { state: RootState }
>(
  "user/updateStatus",
  async ({ userId, status }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.userInfo?.token;
      if (!token) return rejectWithValue("Not authorized");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put<UserInfo>(
        `${API_URL}/${userId}`,
        { status },
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      Cookies.remove("userInfo");
      state.userInfo = null;
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
    },
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.actionStatus = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        if (action.payload.token) {
          state.userInfo = action.payload;
          Cookies.set("userInfo", JSON.stringify(action.payload), {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.userInfo = action.payload;
        Cookies.set("userInfo", JSON.stringify(action.payload), {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(
        fetchAllUsers.fulfilled,
        (state, action: PayloadAction<UserInfo[]>) => {
          state.listStatus = "succeeded";
          state.users = action.payload;
        }
      )
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.singleStatus = "loading";
      })
      .addCase(
        fetchUserById.fulfilled,
        (state, action: PayloadAction<UserInfo>) => {
          state.singleStatus = "succeeded";
          state.selectedUser = action.payload;
        }
      )
      .addCase(fetchUserById.rejected, (state, action) => {
        state.singleStatus = "failed";
        state.singleError = action.payload as string;
      })
      .addCase(updateUserStatus.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(
        updateUserStatus.fulfilled,
        (state, action: PayloadAction<UserInfo>) => {
          state.actionStatus = "succeeded";
          state.selectedUser = action.payload;
          const index = state.users.findIndex(
            (user) => user._id === action.payload._id
          );
          if (index !== -1) {
            state.users[index] = action.payload;
          }
        }
      )
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload as string;
      });
  },
});

export const { logout, resetActionStatus } = userSlice.actions;
export default userSlice.reducer;
