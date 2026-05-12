import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Order } from "../type/order";
import { getMockOrder } from "../data/mockOrder";

export interface OrderTrackingState {
  order: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderTrackingState = {
  order: null,
  loading: false,
  error: null,
};

/**
 * Simulates a network fetch. Pass orderId `"error"` to exercise the error UI.
 */
export const fetchOrder = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>("order/fetchOrder", async (orderId, { rejectWithValue }) => {
  await new Promise((r) => setTimeout(r, 600));
  if (orderId === "error") {
    return rejectWithValue("Could not load order. Try again.");
  }
  return getMockOrder(orderId);
});

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrder: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Unknown error";
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
