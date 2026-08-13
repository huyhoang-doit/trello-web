import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'
import { notificationReducer } from './notifications/notificationSlice'

/**
 * Cấu hình redux-persist
 * https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
 *
 * Thư viện: https://www.npmjs.com/package/redux-persist
 */

import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

// Cấu hình redux-persist
const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'] // Chỉ persist user state, notifications và activeBoard không cần
}

// Kết hợp các reducer
const rootReducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  notifications: notificationReducer
})

// Thực hiện persistReducer
const persistedReducer = persistReducer(rootPersistConfig, rootReducers)

export const store = configureStore({
  reducer: persistedReducer,
  /**
   * Fix lỗi redux persist không tương thích redux toolkit
     https://stackoverflow.com/a/63244831
   */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
})
