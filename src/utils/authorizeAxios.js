import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatter'
// Khởi tạo đối tượng axios
let authorizedAxiosInstance = axios.create()

// Thời gian chờ tối đa mỗi request
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 5

// withCredentials: sẽ cho phép axios tự động gửi cookie trong mỗi request lên be
// Phục vụ cho việc chúng ta sẽ lưu JWT tokens (refresh token và accses token) vào httpOnly cookie của trình duyệt
authorizedAxiosInstance.defaults.withCredentials = true

/**
 * Cấu hình Interceptor ( Bộ đánh chắn giữa mọi request và response )
 */

// Interceptor Request: Can thiệp vào giữa những cái request API
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // Kỹ thuật chăn click spam
    interceptorLoadingElements(true)
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Interceptor Response: Can thiệp vào giữa những cái response nhận về API
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    // Kỹ thuật chăn click spam
    interceptorLoadingElements(false)
    return response
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // Mọi mã http status code nằm ngoài khoảng 2xx sẽ là error và rơi vào đây

    // Kỹ thuật chăn click spam
    interceptorLoadingElements(false)
    let errorMessage = error?.message
    if (error?.response?.data?.message) {
      // Nếu có response từ server
      errorMessage = error?.response?.data?.message
    }
    // Ngoại trừ mã lỗi 410 - GONE ,thì tất cả các mã lỗi khác đều hiển thị thông báo
    if (error?.response?.status !== 410) {
      toast.error(errorMessage)
    }
    // Nếu có mã lỗi 401 - UNAUTHORIZED thì sẽ tự động logout
    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance
