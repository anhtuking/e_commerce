import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    current: null,
    token: null
  },
  reducers: {
    register: (state, action) => {
        console.log(action);
        state.isLoggedIn = action.payload.isLoggedIn
        state.current = action.payload.current
        state.token = action.payload.token
    }
  },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getProducts.pending, (state) => {
//         console.log(state)
//         state.loading = true;
//       })
//       .addCase(getProducts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.newProducts = action.payload; 
//         console.log(action.payload)
//       })
//       .addCase(getProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.errorMessage = action.payload.message;
//       });
//   },
});
export const {register} = userSlice.actions

export default userSlice.reducer;
