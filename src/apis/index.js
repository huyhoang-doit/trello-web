import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

/**
 * Interceptors : là cách đánh chặn vào giữa request or response để xử lý logic
 * Xử lý catch lỗi tập chung tại Interceptors
 */
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  // Note: axios trả về qua property data
  return response.data
}