import { createSlice } from "@reduxjs/toolkit";

export interface OrderState {
  [key: string]: any;
}

const initialState: OrderState = {
  test: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setTest: (state, action: any) => {
      state.test = action.payload;
    },
  },
});

export const { setTest } = orderSlice.actions;
export default orderSlice.reducer;
