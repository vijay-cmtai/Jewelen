import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

// ============================================
// TYPES & INTERFACES
// ============================================

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "Buyer" | "Supplier";
  status: "Pending" | "Approved" | "Rejected";
  isAdmin?: boolean; // ✅ Blog ke liye admin check
  createdAt?: string;
  companyName?: string;
  tradingName?: string;
  businessType?: string;
  companyCountry?: string;
  corporateIdentityNumber?: string;
  companyWebsite?: string;
  companyAddress?: string;
  avatarUrl?: string;
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

// ============================================
// HELPER FUNCTIONS
// ============================================

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

// ============================================
// INITIAL STATE
// ============================================

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

// ============================================
// API CONFIGURATION
// ============================================

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

const getAuthConfig = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const getMultipartConfig = (token: string) => ({
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  },
});

// ============================================
// ASYNC THUNKS
// ============================================

/**
 * Register a new user
 */
export const registerUser = createAsyncThunk<
  { message: string },
  FormData,
  { rejectValue: string }
>("user/register", async (userData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/register`, userData);
    return data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Registration failed";
    return rejectWithValue(message);
  }
});

/**
 * Login user
 */
export const loginUser = createAsyncThunk<
  UserInfo,
  { email: string; password: string },
  { rejectValue: string }
>("user/login", async (loginData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<UserInfo>(`${API_URL}/login`, loginData);

    // Add isAdmin flag based on role
    const userInfoWithAdmin = {
      ...data,
      isAdmin: data.role === "Admin",
    };

    saveUserInfoToStorage(userInfoWithAdmin);
    return userInfoWithAdmin;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Login failed";
    return rejectWithValue(message);
  }
});

/**
 * Fetch all users (Admin only)
 */
export const fetchAllUsers = createAsyncThunk<
  UserInfo[],
  void,
  { state: RootState; rejectValue: string }
>("user/fetchAll", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().user.userInfo?.token;
    if (!token) {
      return rejectWithValue("Not authorized. Please login again.");
    }

    const config = getAuthConfig(token);
    const { data } = await axios.get<{ users: UserInfo[] }>(
      `${API_URL}/users`,
      config
    );
    return data.users;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Failed to fetch users";
    return rejectWithValue(message);
  }
});

/**
 * Fetch single user by ID
 */
export const fetchUserById = createAsyncThunk<
  UserInfo,
  string,
  { state: RootState; rejectValue: string }
>("user/fetchById", async (userId, { getState, rejectWithValue }) => {
  try {
    const token = getState().user.userInfo?.token;
    if (!token) {
      return rejectWithValue("Not authorized. Please login again.");
    }

    const config = getAuthConfig(token);
    const { data } = await axios.get<UserInfo>(
      `${API_URL}/users/${userId}`,
      config
    );
    return data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch user details";
    return rejectWithValue(message);
  }
});

/**
 * Update user profile (with avatar upload support)
 */
export const updateProfile = createAsyncThunk<
  UserInfo,
  FormData,
  { state: RootState; rejectValue: string }
>("user/updateProfile", async (formData, { getState, rejectWithValue }) => {
  try {
    const { userInfo } = getState().user;
    if (!userInfo || !userInfo.token) {
      return rejectWithValue("Not authorized. Please login again.");
    }

    const config = getMultipartConfig(userInfo.token);
    const { data } = await axios.put<UserInfo>(
      `${API_URL}/profile`,
      formData,
      config
    );

    // Merge updated data with existing userInfo
    const updatedUserInfo: UserInfo = {
      ...userInfo,
      ...data,
      token: userInfo.token, // Keep the token
      isAdmin: userInfo.isAdmin, // Keep admin status
    };

    saveUserInfoToStorage(updatedUserInfo);
    return updatedUserInfo;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to update profile";
    return rejectWithValue(message);
  }
});

/**
 * Update user status (Admin only)
 */
export const updateUserStatus = createAsyncThunk<
  UserInfo,
  { userId: string; status: "Approved" | "Rejected" },
  { state: RootState; rejectValue: string }
>(
  "user/updateStatus",
  async ({ userId, status }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.userInfo?.token;
      if (!token) {
        return rejectWithValue("Not authorized. Please login again.");
      }

      const config = getAuthConfig(token);
      const { data } = await axios.patch<UserInfo>(
        `${API_URL}/users/${userId}/status`,
        { status },
        config
      );
      return data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update user status";
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete user (Admin only)
 */
export const deleteUser = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("user/delete", async (userId, { getState, rejectWithValue }) => {
  try {
    const token = getState().user.userInfo?.token;
    if (!token) {
      return rejectWithValue("Not authorized. Please login again.");
    }

    const config = getAuthConfig(token);
    await axios.delete(`${API_URL}/users/${userId}`, config);
    return userId;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Failed to delete user";
    return rejectWithValue(message);
  }
});

// ============================================
// SLICE DEFINITION
// ============================================

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /**
     * Logout user and clear all data
     */
    logout: (state) => {
      removeUserInfoFromStorage();
      state.userInfo = null;
      state.users = [];
      state.selectedUser = null;
      state.actionStatus = "idle";
      state.singleStatus = "idle";
      state.listStatus = "idle";
      state.error = null;
      state.singleError = null;
      state.listError = null;
    },

    /**
     * Reset action status
     */
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },

    /**
     * Reset single user status
     */
    resetSingleStatus: (state) => {
      state.singleStatus = "idle";
      state.singleError = null;
    },

    /**
     * Reset list status
     */
    resetListStatus: (state) => {
      state.listStatus = "idle";
      state.listError = null;
    },

    /**
     * Clear selected user
     */
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    // ========== REGISTER USER ==========
    builder
      .addCase(registerUser.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.actionStatus = "succeeded";
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      });

    // ========== LOGIN USER ==========
    builder
      .addCase(loginUser.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<UserInfo>) => {
          state.actionStatus = "succeeded";
          state.userInfo = action.payload;
          state.error = null;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      });

    // ========== FETCH ALL USERS ==========
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(
        fetchAllUsers.fulfilled,
        (state, action: PayloadAction<UserInfo[]>) => {
          state.listStatus = "succeeded";
          state.users = action.payload;
          state.listError = null;
        }
      )
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload as string;
      });

    // ========== FETCH USER BY ID ==========
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.singleStatus = "loading";
        state.singleError = null;
      })
      .addCase(
        fetchUserById.fulfilled,
        (state, action: PayloadAction<UserInfo>) => {
          state.singleStatus = "succeeded";
          state.selectedUser = action.payload;
          state.singleError = null;
        }
      )
      .addCase(fetchUserById.rejected, (state, action) => {
        state.singleStatus = "failed";
        state.singleError = action.payload as string;
      });

    // ========== UPDATE PROFILE ==========
    builder
      .addCase(updateProfile.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<UserInfo>) => {
          state.actionStatus = "succeeded";
          state.userInfo = action.payload;
          state.error = null;
        }
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      });

    // ========== UPDATE USER STATUS ==========
    builder
      .addCase(updateUserStatus.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(
        updateUserStatus.fulfilled,
        (state, action: PayloadAction<UserInfo>) => {
          state.actionStatus = "succeeded";
          state.error = null;

          // Update user in the users list
          const index = state.users.findIndex(
            (user) => user._id === action.payload._id
          );
          if (index !== -1) {
            state.users[index] = action.payload;
          }

          // Update selected user if it's the same
          if (state.selectedUser?._id === action.payload._id) {
            state.selectedUser = action.payload;
          }
        }
      )
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      });

    // ========== DELETE USER ==========
    builder
      .addCase(deleteUser.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.actionStatus = "succeeded";
        state.error = null;

        // Remove user from the users list
        state.users = state.users.filter((user) => user._id !== action.payload);

        // Clear selected user if it's the deleted one
        if (state.selectedUser?._id === action.payload) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

// ============================================
// EXPORTS
// ============================================

export const {
  logout,
  resetActionStatus,
  resetSingleStatus,
  resetListStatus,
  clearSelectedUser,
} = userSlice.actions;

export default userSlice.reducer;


