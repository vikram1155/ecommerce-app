import { createSlice } from "@reduxjs/toolkit";

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState: { message: "", open: false },
  reducers: {
    showSnackbar: (state, action) => {
      state.message = action.payload;
      state.open = true;
    },

    hideSnackbar: (state) => {
      state.message = "";
      state.open = false;
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
