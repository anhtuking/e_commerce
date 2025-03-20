import { createSlice } from "@reduxjs/toolkit";
import * as actions from './asyncAction'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null,
        isLoading: false,
        message: ''
    },
    reducers: {
        login: (state, action) => {
            console.log('Login action payload:', action.payload);
            state.isLoggedIn = action.payload.isLoggedIn;
            state.token = action.payload.token;
            state.current = action.payload.userData;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.token = null;
            state.current = null;
        },
        clearMessage: (state) => {
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(actions.getCurrent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(actions.getCurrent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.current = action.payload;
            })
            .addCase(actions.getCurrent.rejected, (state, action) => {
                state.isLoading = false;
                state.current = null;
                state.isLoggedIn = false;
                state.token = null;
                state.message = 'Login session expired. Please login again.';
            })
    }
})

export const {login, logout, clearMessage} = userSlice.actions
export default userSlice.reducer
