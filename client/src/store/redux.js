import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./app/appSlice"; 
import productReducer from './product/productSlice'
import userSlice from './user/userSlice'
import chatReducer from './chat/chatSlice'
import storage from 'redux-persist/lib/storage'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

const commonConfig = {
  storage
}
const userConfig = {
  ...commonConfig,
  whitelist: ['isLoggedIn', 'token', 'current'],
  key: 'shop/user'
}
const productConfig = {
  ...commonConfig,
  whitelist: ['dealDaily'],
  key: 'shop/deal'
}

export const store = configureStore({
  reducer: {
    app: appReducer,
    products: persistReducer(productConfig, productReducer),
    user: persistReducer(userConfig, userSlice),
    chat: chatReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store)
