import { createSlice } from "@reduxjs/toolkit";
import { getCurrent } from "./asyncAction";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    current: null,
    token: null,
    mes: "",
  },
  reducers: {
    login: (state, action) => {
      // console.log(action);
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
    },
    logout: (state, action) => {
      state.isLoggedIn = false;
      state.isLoadings = false;
      state.current = null;
      state.token = null;
      state.mes = "";
    },
    clearMessage: (state) => {
      state.mes = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrent.pending, (state) => {
        console.log(state);
        state.isLoadings = true;
      })
      .addCase(getCurrent.fulfilled, (state, action) => {
        state.isLoadings = false;
        state.current = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(getCurrent.rejected, (state, action) => {
        state.isLoadings = false;
        state.current = null;
        state.isLoggedIn = false;
        state.token = null;
        state.mes = "Your session has expired. Please log in again.";
      });
  },
});
export const { login, logout, clearMessage } = userSlice.actions;

export default userSlice.reducer;
