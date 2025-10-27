import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "User";
  status: "Pending" | "Approved" | "Rejected";
  isAdmin?: boolean;
  createdAt?: string;
  profilePicture?: {
    public_id: string;
    url: string;
  };
  token: string;
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
}

const getUserInfoFromStorage = (): UserInfo | null => {
  if (typeof window === "undefined") return null;
  try {
    const userInfoJSON = localStorage.getItem("userInfo");
    return userInfoJSON ? JSON.parse(userInfoJSON) : null;
  } catch (error) {
    console.error("Error parsing userInfo from localStorage:", error);
    return null;
  }
};

const saveUserInfoToStorage = (userInfo: UserInfo): void => {
  try {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  } catch (error) {
    console.error("Error saving userInfo to localStorage:", error);
  }
};

const removeUserInfoFromStorage = (): void => {
  try {
    localStorage.removeItem("userInfo");
  } catch (error) {
    console.error("Error removing userInfo from localStorage:", error);
  }
};

const initialState: UserState = {
  userInfo: getUserInfoFromStorage(),
  users: [],
  selectedUser: null,
  actionStatus: "idle",
  singleStatus: "idle",
  listStatus: "idle",
  error: null,
  singleError: null,
  listError: null,
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
  UserInfo,
  { email: string; otp: string },
  { rejectValue: string }
>("user/verifyOtp", async (otpData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<UserInfo>(
      `${API_URL}/verify-otp`,
      otpData
    );
    const userInfoWithAdmin = { ...data, isAdmin: data.role === "Admin" };
    saveUserInfoToStorage(userInfoWithAdmin);
    return userInfoWithAdmin;
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
    const userInfoWithAdmin = {
      ...data,
      isAdmin: data.role === "Admin",
    };
    saveUserInfoToStorage(userInfoWithAdmin);
    return userInfoWithAdmin;
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      removeUserInfoFromStorage();
      state.userInfo = null;
    },
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
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
        state.userInfo = action.payload;
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.actionStatus = "succeeded";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.actionStatus = "succeeded";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { logout, resetActionStatus } = userSlice.actions;

export default userSlice.reducer;
