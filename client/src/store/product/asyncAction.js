import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from '../../api'

export const getProducts = createAsyncThunk('product/newProducts', async (data, {rejectWithValue}) => {
    const response = await api.apiGetProducts({sort : '-createdAt'})
    if (!response.success) return rejectWithValue(response)
    return response.products
})