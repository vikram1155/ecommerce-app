import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [], // Holds all products
};

const allProductsSlice = createSlice({
  name: "allProducts",
  initialState,
  reducers: {
    setProductsRedux: (state, action) => {
      state.products = action.payload;
    },
    updateProductRedux: (state, action) => {
      const { productId, updatedData } = action.payload;
      state.products = state.products.map((product) =>
        product.productId === productId
          ? { ...product, ...updatedData }
          : product
      );
    },
    deleteProductRedux: (state, action) => {
      state.products = state.products.filter(
        (product) => product.productId !== action.payload
      );
    },
  },
});

export const { setProductsRedux, updateProductRedux, deleteProductRedux } =
  allProductsSlice.actions;
export default allProductsSlice.reducer;
