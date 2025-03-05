import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./app/appSlice"; 
import productReducer from './product/productSlice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    products: productReducer
  },
});
