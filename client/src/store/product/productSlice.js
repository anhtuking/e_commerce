import { createSlice } from "@reduxjs/toolkit";
import { getProducts } from "./asyncAction";


const productSlice = createSlice({
  name: "product",
  initialState: {
    newProducts: null,
    errorMessage: ''
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        console.log(state)
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.newProducts = action.payload; 
        console.log(action.payload)
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload.message;
      });
  },
});

export default productSlice.reducer;
