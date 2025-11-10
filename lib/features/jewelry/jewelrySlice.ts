import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

// ... (JewelryItem, JewelryResponse, etc. interfaces jaise the waise hi rahenge) ...

export interface Gemstone {
  type: string;
  shape?: string;
  carat?: number;
  color?: string;
  clarity?: string;
  cut?: string;
}

export interface Metal {
  type: "Gold" | "Silver" | "Platinum";
  purity: string;
  color?: string;
  weightInGrams: number;
}

export interface Dimensions {
  ringSize?: string;
  lengthInCm?: number;
  widthInMm?: number;
}

export interface JewelryItem {
  _id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  originalPrice?: number;
  tax?: number;
  images: string[];
  stockQuantity: number;
  category: string;
  status: "Pending" | "Approved" | "Rejected";
  metal: Metal;
  gemstones?: Gemstone[];
  dimensions?: Dimensions;
  tags?: string[];
  isFeatured: boolean;
  seller: {
    _id: string;
    name: string;
    email?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface JewelryResponse {
  jewelryItems: JewelryItem[];
  page: number;
  pages: number;
  count: number;
}

interface JewelryState {
  items: JewelryItem[];
  selectedItem: JewelryItem | null;
  myInventory: JewelryItem[];
  pendingItems: JewelryItem[];
  pagination: {
    page: number;
    pages: number;
    count: number;
  } | null;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  singleStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  csvHeaders: string[];
}

const initialState: JewelryState = {
  items: [],
  selectedItem: null,
  myInventory: [],
  pendingItems: [],
  pagination: null,
  listStatus: "idle",
  singleStatus: "idle",
  actionStatus: "idle",
  error: null,
  csvHeaders: [],
};

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/inventory`;
const getToken = (state: RootState) => state.user.userInfo?.token;

export const fetchJewelry = createAsyncThunk<
  JewelryResponse,
  {
    page?: number;
    search?: string;
    sellerId?: string;
    category?: string;
    status?: string;
  },
  { state: RootState }
>(
  "jewelry/fetchAll",
  async (
    { page = 1, search = "", sellerId, category, status },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = getToken(getState());
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      let url = `${API_URL}?page=${page}`;
      if (search) url += `&search=${search}`;
      if (sellerId) url += `&sellerId=${sellerId}`;
      if (category) url += `&category=${category}`;
      if (status && status !== "all") url += `&status=${status}`;

      const { data } = await axios.get<JewelryResponse>(url, config);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch jewelry"
      );
    }
  }
);

export const fetchJewelryById = createAsyncThunk<
  JewelryItem,
  string,
  { state: RootState }
>("jewelry/fetchById", async (id, { rejectWithValue }) => {
  try {
    // Admin ko non-approved products bhi fetch karne ki anumati deni chahiye
    // Isliye token bhej rahe hain, backend ko isko handle karna chahiye.
    // Agar backend handle nahi karta to bhi GET request fail nahi hogi.
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch jewelry item"
    );
  }
});

export const addJewelry = createAsyncThunk<
  { jewelry: JewelryItem; message: string },
  Partial<JewelryItem>,
  { state: RootState }
>("jewelry/add", async (jewelryData, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    if (!token) throw new Error("No token found");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.post(
      `${API_URL}/add-manual`,
      jewelryData,
      config
    );
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to add jewelry"
    );
  }
});

// --- YEH NAYA THUNK ADD KAREIN (UPDATE LOGIC) ---
export const updateJewelry = createAsyncThunk<
  JewelryItem,
  { id: string; updates: Partial<JewelryItem> },
  { state: RootState }
>("jewelry/update", async ({ id, updates }, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    if (!token) throw new Error("No token found");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.put(`${API_URL}/${id}`, updates, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update jewelry"
    );
  }
});

// ... (fetchMyInventory, uploadCsv, etc. functions jaise the waise hi rahenge) ...

export const fetchMyInventory = createAsyncThunk<
  JewelryItem[],
  void,
  { state: RootState }
>("jewelry/fetchMyInventory", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    if (!token) throw new Error("No token found");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_URL}/my-inventory`, config);
    return data.jewelryItems;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch inventory"
    );
  }
});

export const uploadCsv = createAsyncThunk<
  { message: string; newItemsAdded: number; itemsUpdated: number },
  { file: File; mapping: Record<string, string>; sellerId?: string },
  { state: RootState }
>(
  "jewelry/uploadCsv",
  async ({ file, mapping, sellerId }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState());
      if (!token) throw new Error("No token found");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mapping", JSON.stringify(mapping));
      if (sellerId) formData.append("sellerId", sellerId);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post(
        `${API_URL}/upload-csv`,
        formData,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload CSV"
      );
    }
  }
);

export const previewCsvHeaders = createAsyncThunk<
  string[],
  File,
  { state: RootState }
>("jewelry/previewCsvHeaders", async (file, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    if (!token) throw new Error("No token found");
    const formData = new FormData();
    formData.append("file", file);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    const { data } = await axios.post(
      `${API_URL}/preview-csv-headers`,
      formData,
      config
    );
    return data.headers;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to preview headers"
    );
  }
});

export const fetchPendingJewelry = createAsyncThunk<
  JewelryItem[],
  void,
  { state: RootState }
>("jewelry/fetchPending", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    if (!token) throw new Error("No token found");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_URL}/pending`, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch pending items"
    );
  }
});

export const approveJewelry = createAsyncThunk<
  JewelryItem,
  string,
  { state: RootState }
>("jewelry/approve", async (id, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    if (!token) throw new Error("No token found");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.put(`${API_URL}/${id}/approve`, {}, config);
    return data.jewelry;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to approve item"
    );
  }
});

export const rejectJewelry = createAsyncThunk<
  JewelryItem,
  string,
  { state: RootState }
>("jewelry/reject", async (id, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    if (!token) throw new Error("No token found");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.put(`${API_URL}/${id}/reject`, {}, config);
    return data.jewelry;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to reject item"
    );
  }
});

export const deleteJewelry = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("jewelry/delete", async (id, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    if (!token) throw new Error("No token found");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`${API_URL}/${id}`, config);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete jewelry"
    );
  }
});

const jewelrySlice = createSlice({
  name: "jewelry",
  initialState,
  reducers: {
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
      state.singleStatus = "idle";
    },
    clearCsvHeaders: (state) => {
      state.csvHeaders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Jewelry
      .addCase(fetchJewelry.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchJewelry.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.items = action.payload.jewelryItems;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          count: action.payload.count,
        };
      })
      .addCase(fetchJewelry.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload as string;
      })
      // Fetch Jewelry By ID
      .addCase(fetchJewelryById.pending, (state) => {
        state.singleStatus = "loading";
      })
      .addCase(fetchJewelryById.fulfilled, (state, action) => {
        state.singleStatus = "succeeded";
        state.selectedItem = action.payload;
      })
      .addCase(fetchJewelryById.rejected, (state, action) => {
        state.singleStatus = "failed";
        state.error = action.payload as string;
      })
      // Add Jewelry
      .addCase(addJewelry.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(addJewelry.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.items.unshift(action.payload.jewelry);
        state.myInventory.unshift(action.payload.jewelry);
      })
      .addCase(addJewelry.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      })
      // --- UPDATE JEWELRY REDUCERS ADD KAREIN ---
      .addCase(updateJewelry.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(updateJewelry.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const updatedItem = action.payload;
        state.selectedItem = updatedItem;
        // Update the item in the main list
        const index = state.items.findIndex(
          (item) => item._id === updatedItem._id
        );
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
      })
      .addCase(updateJewelry.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      })
      // Delete Jewelry
      .addCase(deleteJewelry.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload);
        state.myInventory = state.myInventory.filter(
          (i) => i._id !== action.payload
        );
      })
      // ... (baaki ke extraReducers jaise the waise hi rahenge) ...
      .addCase(fetchMyInventory.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchMyInventory.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.myInventory = action.payload;
      })
      .addCase(fetchMyInventory.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload as string;
      });

    const handleApprovalAction = (state: JewelryState, action: any) => {
      state.actionStatus = "succeeded";
      const updatedItem = action.payload;
      const itemIndex = state.items.findIndex(
        (item) => item._id === updatedItem._id
      );
      if (itemIndex !== -1) {
        state.items[itemIndex] = updatedItem;
      }
      const myInventoryIndex = state.myInventory.findIndex(
        (item) => item._id === updatedItem._id
      );
      if (myInventoryIndex !== -1) {
        state.myInventory[myInventoryIndex] = updatedItem;
      }
    };

    builder
      .addCase(approveJewelry.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(approveJewelry.fulfilled, handleApprovalAction)
      .addCase(approveJewelry.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      })
      .addCase(rejectJewelry.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(rejectJewelry.fulfilled, handleApprovalAction)
      .addCase(rejectJewelry.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetActionStatus, clearSelectedItem, clearCsvHeaders } =
  jewelrySlice.actions;

export default jewelrySlice.reducer;
