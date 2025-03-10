import { createSlice } from "@reduxjs/toolkit";
import { getCurrent } from "./asyncAction";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    current: null,
    token: null
  },
  reducers: {
    login: (state, action) => {
        // console.log(action);
        state.isLoggedIn = action.payload.isLoggedIn
        state.token = action.payload.token
    },
    logout: (state, action) => {
      state.isLoggedIn = false
      state.token = null
  },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrent.pending, (state) => {
        console.log(state)
        state.isLoadings = true;
      })
      .addCase(getCurrent.fulfilled, (state, action) => {
        state.isLoadings = false;
        state.current = action.payload; 
        // console.log(action.payload)
      })
      .addCase(getCurrent.rejected, (state, action) => {
        state.isLoadings = false;
        state.current = null;
      });
  },
});
export const {login, logout} = userSlice.actions

export default userSlice.reducer;
