import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from '../api'

export const getCategories = createAsyncThunk('app/categories', async (data, {rejectWithValue}) => {
    const response = await api.apiGetCategories()
    if (!response.success) return rejectWithValue(response)
    return response.productCategories
})