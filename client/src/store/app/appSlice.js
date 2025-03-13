import { createSlice } from "@reduxjs/toolkit";
import { getCategories } from "./asyncAction";

const appSlice = createSlice({
  name: "app",
  initialState: {
    categories: null,
    loading: false,
    error: null,
    isShowModal: false,
    modalChildren: null,
  },
  reducers: {
    showModal: (state, action) => {
      state.isShowModal = action.payload.isShowModal;
      state.modalChildren = action.payload.modalChildren;
    },
  },
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

export const { showModal } = appSlice.actions;

export default appSlice.reducer;
