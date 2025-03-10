import { createSlice } from "@reduxjs/toolkit";
import { getCategories } from "./asyncAction";

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.isLoadings = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoadings = false;
        state.categories = action.payload; 
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoadings = false;
        state.error = action.payload;
      });
  },
});

export default appSlice.reducer;
