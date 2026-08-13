/**
 * Socket.IO Client Utilities
 * Quản lý kết nối WebSocket phía frontend
 *
 * Sử dụng Singleton pattern: chỉ có một socket instance cho toàn app
 * Kết nối sau khi user đăng nhập thành công
 * Ngắt kết nối khi user đăng xuất
 */
import { io } from 'socket.io-client'
import { API_ROOT } from './constants'

// Singleton socket instance
let socket = null

/**
 * Khởi tạo kết nối socket và đăng ký personal room của user
 * @param {string} userId - ID của user đang đăng nhập
 * @returns {object} socket instance
 */
export const connectSocket = (userId) => {
  socket = io(API_ROOT, {
    // Gửi cookie kèm theo (để backend có thể xác thực nếu cần)
    withCredentials: true,
    // Chỉ kết nối lại tự động khi mất mạng, không kết nối lại khi server disconnect
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  })

  socket.on('connect', () => {
    // Đăng ký personal room dựa trên userId để nhận notification
    if (userId) {
      socket.emit('FE_REGISTER_USER', userId)
    }
  })

  socket.on('connect_error', (error) => {
    // eslint-disable-next-line no-console
    console.warn('Socket connection error:', error.message)
  })

  return socket
}

/**
 * Lấy socket instance hiện tại
 * @returns {object|null} socket instance hoặc null nếu chưa kết nối
 */
export const getSocket = () => socket

/**
 * Ngắt kết nối socket (gọi khi user logout)
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

/**
 * User join vào board room khi mở board detail
 * @param {string} boardId
 */
export const joinBoardRoom = (boardId) => {
  if (socket && boardId) {
    socket.emit('FE_JOIN_BOARD', boardId)
  }
}

/**
 * User rời board room khi đóng board
 * @param {string} boardId
 */
export const leaveBoardRoom = (boardId) => {
  if (socket && boardId) {
    socket.emit('FE_LEAVE_BOARD', boardId)
  }
}
