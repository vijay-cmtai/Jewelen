import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

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
  originalPrice?: number; // <-- YEH SABSE ZAROORI BADLAV HAI
  images: string[];
  stockQuantity: number;
  category:
    | "Rings"
    | "New Arrivals"
    | "Necklaces"
    | "Earrings"
    | "Bracelets"
    | "Gifts";
  metal: Metal;
  gemstones?: Gemstone[];
  dimensions?: Dimensions;
  tags?: string[];
  isFeatured: boolean;
  seller: {
    _id: string;
    name: string;
    email?: string;
  };
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
  pagination: null,
  listStatus: "idle",
  singleStatus: "idle",
  actionStatus: "idle",
  error: null,
  csvHeaders: [],
};

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/inventory`;
const getToken = (state: RootState) => state.user.userInfo?.token;

function sanitizeObjectId(id: string): string {
  if (!id) return id;
  let sanitized = id.trim();
  if (sanitized.length > 24) {
    sanitized = sanitized.substring(0, 24);
  }
  return sanitized;
}

function sanitizeJewelryItem(item: any): JewelryItem {
  return {
    ...item,
    _id: sanitizeObjectId(item._id),
    seller: {
      ...item.seller,
      _id: sanitizeObjectId(item.seller._id),
    },
  };
}

export const fetchJewelry = createAsyncThunk<
  JewelryResponse,
  { page?: number; search?: string; sellerId?: string; category?: string },
  { state: RootState }
>(
  "jewelry/fetchAll",
  async (
    { page = 1, search = "", sellerId, category },
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

      const { data } = await axios.get<JewelryResponse>(url, config);

      const sanitizedData = {
        ...data,
        jewelryItems: data.jewelryItems.map(sanitizeJewelryItem),
      };

      return sanitizedData;
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
    const sanitizedId = sanitizeObjectId(id);
    const { data } = await axios.get(`${API_URL}/${sanitizedId}`);
    return sanitizeJewelryItem(data);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch jewelry item"
    );
  }
});

export const fetchJewelryBySku = createAsyncThunk<
  JewelryItem,
  string,
  { state: RootState }
>("jewelry/fetchBySku", async (sku, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/sku/${sku}`);
    return sanitizeJewelryItem(data);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch jewelry item"
    );
  }
});

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
    return data.jewelryItems.map(sanitizeJewelryItem);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch inventory"
    );
  }
});

export const addJewelry = createAsyncThunk<
  JewelryItem,
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
    return sanitizeJewelryItem(data);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to add jewelry"
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

export const previewHeadersFromUrl = createAsyncThunk<
  string[],
  string,
  { state: RootState }
>(
  "jewelry/previewHeadersUrl",
  async (apiUrl, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState());
      if (!token) throw new Error("No token found");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(
        `${API_URL}/preview-headers-url`,
        { apiUrl },
        config
      );
      return data.headers;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to preview headers"
      );
    }
  }
);

export const updateJewelry = createAsyncThunk<
  JewelryItem,
  { id: string; updates: Partial<JewelryItem> },
  { state: RootState }
>("jewelry/update", async ({ id, updates }, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    if (!token) throw new Error("No token found");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const sanitizedId = sanitizeObjectId(id);
    const { data } = await axios.put(
      `${API_URL}/${sanitizedId}`,
      updates,
      config
    );
    return sanitizeJewelryItem(data);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update jewelry"
    );
  }
});

export const updateStock = createAsyncThunk<
  JewelryItem,
  { id: string; stockQuantity: number },
  { state: RootState }
>(
  "jewelry/updateStock",
  async ({ id, stockQuantity }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState());
      if (!token) throw new Error("No token found");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const sanitizedId = sanitizeObjectId(id);
      const { data } = await axios.put(
        `${API_URL}/${sanitizedId}/stock`,
        { stockQuantity },
        config
      );
      return sanitizeJewelryItem(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update stock"
      );
    }
  }
);

export const deleteJewelry = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("jewelry/delete", async (id, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    if (!token) throw new Error("No token found");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const sanitizedId = sanitizeObjectId(id);
    await axios.delete(`${API_URL}/${sanitizedId}`, config);
    return sanitizedId;
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
      .addCase(fetchJewelry.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
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
      });

    builder
      .addCase(fetchJewelryById.pending, (state) => {
        state.singleStatus = "loading";
        state.error = null;
      })
      .addCase(fetchJewelryById.fulfilled, (state, action) => {
        state.singleStatus = "succeeded";
        state.selectedItem = action.payload;
      })
      .addCase(fetchJewelryById.rejected, (state, action) => {
        state.singleStatus = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchJewelryBySku.pending, (state) => {
        state.singleStatus = "loading";
        state.error = null;
      })
      .addCase(fetchJewelryBySku.fulfilled, (state, action) => {
        state.singleStatus = "succeeded";
        state.selectedItem = action.payload;
      })
      .addCase(fetchJewelryBySku.rejected, (state, action) => {
        state.singleStatus = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchMyInventory.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(fetchMyInventory.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.myInventory = action.payload;
      })
      .addCase(fetchMyInventory.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(addJewelry.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(addJewelry.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.items.unshift(action.payload);
        state.myInventory.unshift(action.payload);
      })
      .addCase(addJewelry.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(uploadCsv.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(uploadCsv.fulfilled, (state) => {
        state.actionStatus = "succeeded";
      })
      .addCase(uploadCsv.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(previewCsvHeaders.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(previewCsvHeaders.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.csvHeaders = action.payload;
      })
      .addCase(previewCsvHeaders.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(previewHeadersFromUrl.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(previewHeadersFromUrl.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.csvHeaders = action.payload;
      })
      .addCase(previewHeadersFromUrl.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(updateJewelry.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(updateJewelry.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const index = state.items.findIndex(
          (i) => i._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
        const myIndex = state.myInventory.findIndex(
          (i) => i._id === action.payload._id
        );
        if (myIndex !== -1) state.myInventory[myIndex] = action.payload;
        if (state.selectedItem?._id === action.payload._id) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(updateJewelry.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(updateStock.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const index = state.items.findIndex(
          (i) => i._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
        const myIndex = state.myInventory.findIndex(
          (i) => i._id === action.payload._id
        );
        if (myIndex !== -1) state.myInventory[myIndex] = action.payload;
        if (state.selectedItem?._id === action.payload._id) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteJewelry.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(deleteJewelry.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.items = state.items.filter((i) => i._id !== action.payload);
        state.myInventory = state.myInventory.filter(
          (i) => i._id !== action.payload
        );
        if (state.selectedItem?._id === action.payload) {
          state.selectedItem = null;
        }
      })
      .addCase(deleteJewelry.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetActionStatus, clearSelectedItem, clearCsvHeaders } =
  jewelrySlice.actions;
export default jewelrySlice.reducer;
