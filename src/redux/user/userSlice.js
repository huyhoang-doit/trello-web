import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// Khởi tạo giá trị ban đầu cho state
const initialState = {
  currentUser: null
}

// Những hành động gọi api (bất đồng bộ) sẽ được xử lý ở đây, dùng middleware createAsyncThunk đi kèm với extraReducers
// https://redux-toolkit.js.org/api/createAsyncThunk
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/users/login`,
      data
    )
    return response.data
  }
)

// Tạo một cái slice trong Redux store
export const userSlice = createSlice({
  name: 'user',
  initialState,

  // Nơi xử lý dữ liệu đồng bộ
  reducers: {},

  // Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      // action.payload là response.data từ API
      let user = action.payload
      state.currentUser = user
    })
  }
})

// export const {} = userSlice.actions

// Selector để lấy dữ liệu từ Redux store: là nơi dành cho các components bên dưới dọi bằng hook useSelector()
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

// export default activeBoardSlice.reducer
export const userReducer = userSlice.reducer
