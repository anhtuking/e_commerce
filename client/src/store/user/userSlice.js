import { createSlice } from "@reduxjs/toolkit";
import * as actions from './asyncAction'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null,
        isLoading: false,
        mes: '',
        currentCart: []
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.token = null;
            state.current = null;
        },
        clearMessage: (state) => {
            state.mes = '';
        },
        updateCart: (state, action) => {
            const {pid, quantity, color} = action.payload;
            const updateItem = state.currentCart.find(item => item.product?._id === pid && item.color === color);
            if (updateItem) {
                updateItem.quantity = quantity;
            } else {
                // state.currentCart.push({product: {_id: pid}, quantity, color});
                state.mes = 'Try again'
            }
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
                state.isLoggedIn = true;
                state.currentCart = action.payload.cart;
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

export const {login, logout, clearMessage, updateCart} = userSlice.actions
export default userSlice.reducer
