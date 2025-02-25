import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderList: [],
};

const orderListSlice = createSlice({
  name: "orderList",
  initialState,
  reducers: {
    addOrUpdateOrder: (state, action) => {
      const { userId, userEmail, productId, quantity, orderedOn, etd, status } =
        action.payload;

      const existingOrder = state.orderList.find(
        (order) => order.productId === productId
      );

      if (existingOrder) {
        // Update quantity if product exists
        existingOrder.quantity += quantity;
      } else {
        // Add new order if product does not exist
        state.orderList.push({
          userId,
          userEmail,
          productId,
          quantity,
          orderedOn,
          etd,
          status,
        });
      }
    },
  },
});

export const { addOrUpdateOrder } = orderListSlice.actions;
export default orderListSlice.reducer;
