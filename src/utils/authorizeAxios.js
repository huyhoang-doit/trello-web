import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatter'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

/**
 * Không thể import store của redux vào trong file này được
 * Giải phảp: Inject store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component
 * như file hiện tại
 * Hiểu đơn giản: khi ứng dụng bắt đầu chạy lên, code sẽ chạy vào main.jsx đầu tiên, từ bên đô chúng ta gọi hàm injectStore và truyền vào store của redux
 * Sau đó, khi cần sử dụng store ở bên ngoài component, chúng ta sẽ gọi hàm useSelector
 * https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
 */

let axiosReduxStore

export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore
}

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
let refreshTokenPromise = null
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

    // Trường hợp 1: Nếu nhận mã 401 thì đăng xuất luôn
    if (error?.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false))
    }

    // Trường hợp 2: Nếu nhận mã 410 thì refresh token
    const originalRequest = error?.config
    if (error?.response?.status == 410 && !originalRequest._retry) {
      // Gán thêm giá trị _retry = true để tránh việc request refresh token bị lặp lại, đảm bảo việc refresh token này chỉ luôn gọi lại 1 lần một thời điểm
      originalRequest._retry = true
     
      // Kiểm tra chưa có refresh token thì thực hiện gán việc gọi api refresh token đồng thời gán vào cái refreshPromise
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            // Gán lại giá trị access token mới cho authorizedAxiosInstance
            return data?.accessToken
          })
          .catch((_error) => {
            // Nếu gặp lỗi khi refresh token thì sẽ đăng xuất ngay lập tức
            axiosReduxStore.dispatch(logoutUserAPI(false))
            return Promise.reject(_error)
          })
          .finally(() => {
            // Xóa giá trị refreshTokenPromise để tránh việc gọi lại api refresh token nhiều lần
            refreshTokenPromise = null
          })
      }

      return refreshTokenPromise.then((accessToken) => {
       // Nếu cần lưu lại accessToken vào localstorage thì thực hiện ở đây
        // Gọi lại request cũ
        return authorizedAxiosInstance(originalRequest)
      })
    }

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
