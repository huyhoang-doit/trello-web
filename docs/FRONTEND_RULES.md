# FRONTEND DEVELOPMENT RULES - TRELLO WEB

## Tech Stack

| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| React | ^18.2.0 | UI framework |
| MUI v5 | ^5.13.0 | Component library |
| Redux Toolkit | ^2.7.0 | State management |
| Redux Persist | ^6.0.0 | Persist user state |
| React Router DOM | ^6.30.0 | Routing |
| Axios | ^1.7.4 | HTTP client |
| React Hook Form | ^7.56.1 | Form handling |
| socket.io-client | ^4.x | WebSocket |
| moment | ^2.x | Date formatting |

---

## 1. State Management (Redux)

### Store structure
```
store/
├── user/userSlice.js           ✅ Persist: YES
├── activeBoard/activeBoardSlice.js  ✅ Persist: NO
└── notifications/notificationSlice.js  ✅ Persist: NO
```

### Tạo Async Action
```js
// Dùng createAsyncThunk cho tất cả API calls trong slice
export const fetchDataAPI = createAsyncThunk(
  'sliceName/fetchDataAPI',
  async (params) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/xxx`)
    return response.data // Trả về data từ API
  }
)

// Xử lý trong extraReducers
builder.addCase(fetchDataAPI.fulfilled, (state, action) => {
  state.data = action.payload
})
```

### Selectors
```js
// Đặt selector trong file slice, export ra để dùng trong component
export const selectCurrentUser = (state) => state.user.currentUser
export const selectCurrentNotifications = (state) => state.notifications.currentNotifications
```

---

## 2. API Calls

### Quy tắc
- **TẤT CẢ** API calls phải đi qua `authorizedAxiosInstance` (có interceptors)
- Khai báo function trong `src/apis/index.js`
- Không gọi axios trực tiếp trong component

```js
// src/apis/index.js
export const createInvitationAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/invitations/board`, data)
  return response.data // Luôn return response.data
}
```

### Auth được xử lý tự động
- 401 → tự động logout
- 410 → tự động refresh token rồi retry
- Error → hiển thị toast.error() tự động

---

## 3. Styling (MUI)

### Quy tắc
- Dùng `sx` prop cho styling inline
- Dùng `theme` callback cho dynamic values
- Theo `theme.js` cho colors, spacing
- KHÔNG dùng Tailwind hoặc CSS thuần trừ khi cần thiết

```jsx
// ✅ Đúng
<Box sx={{
  bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0',
  height: (theme) => theme.trello.appBarHeight
}} />

// ❌ Sai
<Box style={{ backgroundColor: '#1565c0' }} />
```

### Theme Variables
```js
theme.trello.appBarHeight     // Chiều cao AppBar
theme.trello.boardBarHeight   // Chiều cao BoardBar
theme.trello.boardContentHeight // Chiều cao Board Content
```

---

## 4. Routing

```jsx
// Protected routes: wrap trong ProtectedRoute
// Public routes: /login, /register, /account/verify-email

// Tạo route mới trong App.jsx trong Route element={<ProtectedRoute>}
<Route path="/new-path" element={<NewPage />} />
```

---

## 5. Socket.IO

```js
// Kết nối: tự động sau khi login (trong App.jsx useEffect)
// Ngắt kết nối: tự động khi logout

// Import utilities từ src/utils/socket.js
import { getSocket, joinBoardRoom, leaveBoardRoom } from '~/utils/socket'

// Lắng nghe event trong component
useEffect(() => {
  const socket = getSocket()
  if (!socket) return

  socket.on('FE_RECEIVE_NOTIFICATION', (data) => {
    dispatch(addNotification(data))
  })

  return () => {
    socket.off('FE_RECEIVE_NOTIFICATION') // Cleanup quan trọng!
  }
}, [dispatch])
```

### Socket Events Reference
| FE → BE | Mục đích |
|---|---|
| `FE_REGISTER_USER` | Đăng ký personal room (auto khi connect) |
| `FE_JOIN_BOARD` | Join board room khi vào board |
| `FE_LEAVE_BOARD` | Leave board room khi rời board |

| BE → FE | Mục đích |
|---|---|
| `FE_RECEIVE_NOTIFICATION` | Nhận board invitation |
| `FE_RECEIVE_BOARD_COMMENT` | Nhận comment mới trong board |

---

## 6. Form Handling (React Hook Form)

```jsx
import { useForm } from 'react-hook-form'

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => { /* gọi API */ }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('email', { required: 'Email is required' })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
    </form>
  )
}
```

---

## 7. Toast Notifications

```js
import { toast } from 'react-toastify'

toast.success('Thành công!')
toast.error('Có lỗi xảy ra!')
toast.info('Thông báo')
toast.warning('Cảnh báo')
```

> ❗ Axios interceptors đã tự động toast.error() cho lỗi API. KHÔNG toast error thêm lần nữa trong component.

---

## 8. Component Structure

```
src/
├── pages/          # Page-level components (route components)
├── components/     # Shared reusable components
│   ├── AppBar/     # Global app bar
│   ├── Loading/    # Loading spinners
│   └── Modal/      # Dialog/Modal components
└── redux/          # State management
```

---

## 9. File Naming

| Item | Convention | Ví dụ |
|---|---|---|
| Component | PascalCase | `BoardContent.jsx` |
| Slice | camelCase | `notificationSlice.js` |
| Utility | camelCase | `socket.js`, `formatter.js` |
| CSS | camelCase | `index.css` |

---

## 10. Alias Import

Dùng `~` thay cho đường dẫn tuyệt đối (đã config trong vite.config.js):

```js
import { API_ROOT } from '~/utils/constants'     // ✅
import { API_ROOT } from '../../../utils/constants' // ❌
```
