import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { isEmpty } from 'lodash'
import { API_ROOT } from '~/utils/constants'
import { generatedPlaceholderCard } from '~/utils/formatter'
import { mapOrder } from '~/utils/sorts'

// Khởi tạo giá trị ban đầu cho state
const initialState = {
  currentActiveBoard: null
}

// Những hành động gọi api (bất đồng bộ) sẽ được xử lý ở đây, dùng middleware createAsyncThunk đi kèm với extraReducers
// https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
    return response.data
  }
)

// Tạo một cái slice trong Redux store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,

  // Nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là một chuẩn đặt tên nhận dữ liệu vào reducer
      const board = action.payload

      // Xử lý dữ liệu

      state.currentActiveBoard = board
    }
  },

  // Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload là response.data từ API
      let board = action.payload

      // Xử lý dữ liệu
      board.columns = mapOrder(board?.columns, board?.columnOrderIds, '_id')

      board.columns.forEach((column) => {
        // Fake empty card cho FE
        if (isEmpty(column.cards)) {
          column.cards = [generatedPlaceholderCard(column)]
          column.cardOrderIds = [generatedPlaceholderCard(column)._id]
        } else {
          // Sắp xếp thứ tự các cards trong columns
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      state.currentActiveBoard = board
    })
  }
})

// Action creators are generated for each case reducer function
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// Selector để lấy dữ liệu từ Redux store: là nơi dành cho các components bên dưới dọi bằng hook useSelector()
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer
