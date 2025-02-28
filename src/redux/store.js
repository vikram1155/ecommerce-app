import { configureStore } from "@reduxjs/toolkit";
import allProductsReducer from "./allProductsSlice";
import orderListReducer from "./orderListSlice";
import snackbarReducer from "./snackbarSlice";

const store = configureStore({
  reducer: {
    allProducts: allProductsReducer,
    orderList: orderListReducer,
    snackbar: snackbarReducer,
  },
});

export default store;
