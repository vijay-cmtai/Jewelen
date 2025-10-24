import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

// --- Types (Data ka Structure) ---
// Yeh type aapke Mongoose model aur controller se match karta hai
export interface Address {
  _id: string;
  user: string; // User's ID
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType: "Home" | "Work";
  isDefault: boolean;
}

// Slice ki State ka Structure
interface AddressState {
  addresses: Address[];
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// --- Initial State (Shuruaati State) ---
const initialState: AddressState = {
  addresses: [],
  listStatus: "idle", // For fetching the list
  actionStatus: "idle", // For add, update, delete actions
  error: null,
};

// --- API URL ---
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/addresses`;

// --- ASYNC THUNKS (Backend se Data Laane Wale Functions) ---

// 1. User ke sabhi addresses fetch karne ke liye
export const fetchAddresses = createAsyncThunk<
  Address[],
  void,
  { state: RootState }
>("address/fetchAddresses", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().user.userInfo?.token;
    if (!token) throw new Error("Not authorized");

    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get<Address[]>(API_URL, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Could not fetch addresses"
    );
  }
});

// 2. Naya address add karne ke liye
export const addAddress = createAsyncThunk<
  Address,
  Partial<Omit<Address, "_id" | "user">>,
  { state: RootState }
>("address/addAddress", async (addressData, { getState, rejectWithValue }) => {
  try {
    const token = getState().user.userInfo?.token;
    if (!token) throw new Error("Not authorized");

    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.post<Address>(API_URL, addressData, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Could not add address"
    );
  }
});

// 3. Address ko update karne ke liye
export const updateAddress = createAsyncThunk<
  Address,
  { addressId: string; updates: Partial<Address> },
  { state: RootState }
>(
  "address/updateAddress",
  async ({ addressId, updates }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.userInfo?.token;
      if (!token) throw new Error("Not authorized");

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put<Address>(
        `${API_URL}/${addressId}`,
        updates,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Could not update address"
      );
    }
  }
);
export const deleteAddress = createAsyncThunk<
  string,
  { addressId: string },
  { state: RootState }
>(
  "address/deleteAddress",
  async ({ addressId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.userInfo?.token;
      if (!token) throw new Error("Not authorized");

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/${addressId}`, config);
      return addressId; // Safal hone par ID return karein taaki UI se hata sakein
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Could not delete address"
      );
    }
  }
);

export const setDefaultAddress = createAsyncThunk<
  Address[],
  { addressId: string },
  { state: RootState }
>(
  "address/setDefaultAddress",
  async ({ addressId }, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getState().user.userInfo?.token;
      if (!token) throw new Error("Not authorized");

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${API_URL}/default/${addressId}`, {}, config);
      const updatedAddresses = await dispatch(fetchAddresses()).unwrap();
      return updatedAddresses;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Could not set default address"
      );
    }
  }
);

// --- SLICE DEFINITION ---
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    // Action status ko reset karne ke liye
    resetAddressStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Generic handlers for action statuses
    const pendingAction = (state: AddressState) => {
      state.actionStatus = "loading";
      state.error = null;
    };
    const rejectedAction = (
      state: AddressState,
      action: PayloadAction<any>
    ) => {
      state.actionStatus = "failed";
      state.error = action.payload;
    };

    builder
      // Fetch Addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(
        fetchAddresses.fulfilled,
        (state, action: PayloadAction<Address[]>) => {
          state.listStatus = "succeeded";
          state.addresses = action.payload;
        }
      )
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload as string;
      })

      // Add Address
      .addCase(addAddress.pending, pendingAction)
      .addCase(
        addAddress.fulfilled,
        (state, action: PayloadAction<Address>) => {
          state.actionStatus = "succeeded";
          if (action.payload.isDefault) {
            state.addresses.forEach((addr) => (addr.isDefault = false));
          }
          state.addresses.push(action.payload);
        }
      )
      .addCase(addAddress.rejected, rejectedAction)

      // Update Address
      .addCase(updateAddress.pending, pendingAction)
      .addCase(
        updateAddress.fulfilled,
        (state, action: PayloadAction<Address>) => {
          state.actionStatus = "succeeded";
          const index = state.addresses.findIndex(
            (addr) => addr._id === action.payload._id
          );
          if (index !== -1) {
            state.addresses[index] = action.payload;
          }
        }
      )
      .addCase(updateAddress.rejected, rejectedAction)

      // Delete Address
      .addCase(deleteAddress.pending, pendingAction)
      .addCase(
        deleteAddress.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.actionStatus = "succeeded";
          state.addresses = state.addresses.filter(
            (addr) => addr._id !== action.payload
          );
        }
      )
      .addCase(deleteAddress.rejected, rejectedAction)

      // Set Default Address
      .addCase(setDefaultAddress.pending, pendingAction)
      .addCase(
        setDefaultAddress.fulfilled,
        (state, action: PayloadAction<Address[]>) => {
          state.actionStatus = "succeeded";
          state.addresses = action.payload; 
        }
      )
      .addCase(setDefaultAddress.rejected, rejectedAction);
  },
});

export const { resetAddressStatus } = addressSlice.actions;
export default addressSlice.reducer;
