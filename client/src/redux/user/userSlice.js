import { createSlice } from '@reduxjs/toolkit';
import * as actions from './asyncActions';

// Đảm bảo currentUser được lưu trong localStorage
const userState = localStorage.getItem('persist:user') ? 
  JSON.parse(JSON.parse(localStorage.getItem('persist:user')).currentUser) : 
  null;

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: Boolean(userState),
    currentUser: userState,
    token: null,
    currentCart: [],
    isLoading: false,
    mes: ''
  },
  reducers: {
    // Các reducers khác
    // ...

    login: (state, action) => {
      state.isLoggedIn = true;
      state.currentUser = action.payload.userData;
      state.token = action.payload.accessToken;
      // Lưu người dùng vào localStorage để persist
      localStorage.setItem('userInfo', JSON.stringify(action.payload.userData));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.currentUser = null;
      state.currentCart = [];
      // Xóa thông tin người dùng khỏi localStorage
      localStorage.removeItem('userInfo');
    },
  },
  // extraReducers và các phần khác giữ nguyên
}); 