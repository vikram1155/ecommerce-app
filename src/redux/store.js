import { configureStore } from "@reduxjs/toolkit";
import allProductsReducer from "./allProductsSlice";
import orderListReducer from "./orderListSlice";

const store = configureStore({
  reducer: {
    allProducts: allProductsReducer,
    orderList: orderListReducer,
  },
});

export default store;
