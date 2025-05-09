import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'

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
  whitelist: ['user'] // Định nghĩa các slice dữ liệu được phép duy trì qua mỗi lần f5 trình duyệt
  // blacklist: ['activeBoard'] // Định nghĩa các slice dữ liệu không được phép duy trì qua mỗi lần f5 trình duyệt
}
// Kết hợp các reducer
const rootReducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer
})
// Thực hiện persistReducer
const persistedReducer = persistReducer(rootPersistConfig, rootReducers)

export const store = configureStore({
  reducer: persistedReducer
})
