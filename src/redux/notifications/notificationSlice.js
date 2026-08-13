/**
 * Notification Redux Slice
 * Quản lý state thông báo của user (board invitations, etc.)
 *
 * State structure:
 * {
 *   currentNotifications: [
 *     {
 *       _id: string,
 *       type: 'BOARD_INVITATION',
 *       details: {
 *         board: { _id, title, description, type },
 *         inviter: { _id, displayName, email, avatar }
 *       },
 *       boardInvitation: {
 *         boardId: string,
 *         status: 'pending' | 'accepted' | 'declined'
 *       },
 *       createdAt: Date,
 *       isRead: boolean
 *     }
 *   ]
 * }
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'

// Khởi tạo state ban đầu
const initialState = {
  currentNotifications: null // null = chưa tải, [] = đã tải nhưng rỗng
}

/**
 * Fetch danh sách notifications của current user
 */
export const fetchInvitationsAPI = createAsyncThunk(
  'notifications/fetchInvitationsAPI',
  async () => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/invitations`
    )
    return response.data
  }
)

/**
 * User accept hoặc decline board invitation
 */
export const updateBoardInvitationAPI = createAsyncThunk(
  'notifications/updateBoardInvitationAPI',
  async ({ invitationId, status }) => {
    const response = await authorizedAxiosInstance.put(
      `${API_ROOT}/v1/invitations/${invitationId}/board`,
      { status }
    )
    return response.data
  }
)

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,

  reducers: {
    /**
     * Thêm notification mới vào đầu danh sách (từ socket event)
     */
    addNotification: (state, action) => {
      const incomingNotification = action.payload
      // Thêm vào đầu mảng để notification mới nhất hiển thị trên cùng
      state.currentNotifications.unshift(incomingNotification)
    },

    /**
     * Xóa toàn bộ notifications (khi logout)
     */
    clearNotifications: (state) => {
      state.currentNotifications = null
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchInvitationsAPI.fulfilled, (state, action) => {
      // Sắp xếp notifications mới nhất lên đầu
      let notifications = action.payload
      state.currentNotifications = Array.isArray(notifications)
        ? notifications.reverse()
        : []
    })

    builder.addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
      const updatedInvitation = action.payload

      // Cập nhật lại invitation trong danh sách
      const foundInvitation = state.currentNotifications.find(
        (n) => n._id === updatedInvitation._id
      )
      if (foundInvitation) {
        foundInvitation.boardInvitation = updatedInvitation.boardInvitation
      }

      // Hiển thị toast theo kết quả
      if (updatedInvitation.boardInvitation?.status === 'accepted') {
        toast.success('Đã chấp nhận lời mời vào board!')
      } else {
        toast.info('Đã từ chối lời mời.')
      }
    })
  }
})

export const { addNotification, clearNotifications } = notificationSlice.actions

// Selectors
export const selectCurrentNotifications = (state) =>
  state.notifications.currentNotifications

export const notificationReducer = notificationSlice.reducer
