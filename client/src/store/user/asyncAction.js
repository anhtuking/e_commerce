import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from '../../api'

export const getCurrent = createAsyncThunk('user/current', async (data, {rejectWithValue}) => {
    const response = await api.apiGetCurrent()
    console.log(response);
    if (!response.success) return rejectWithValue(response)
    return response.result
})