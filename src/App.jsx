import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
import NotFound from './pages/404/NotFound'
import Auth from './pages/Auth/Auth'
import AccountVerification from './pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from '~/pages/Settings/Settings'
import Boards from './pages/Boards'
import { useEffect } from 'react'
import { connectSocket, disconnectSocket } from '~/utils/socket'

const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to="/login" replace={true} />
  }
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  // Kết nối socket khi user đăng nhập, ngắt kết nối khi logout
  useEffect(() => {
    if (currentUser?._id) {
      connectSocket(currentUser._id)
    } else {
      disconnectSocket()
    }
    return () => {
      disconnectSocket()
    }
  }, [currentUser])

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to="/boards" replace={true} />
        }
      />

      <Route element={<ProtectedRoute user={currentUser} />}>
        {/* Board Details */}
        <Route path="/boards/:boardId" element={<Board />} />
        <Route path="/boards" element={<Boards />} />

        {/* User settings */}
        <Route path="/settings/account" element={<Settings />} />
        <Route path="/settings/security" element={<Settings />} />
      </Route>

      {/* Authentication */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verify-email" element={<AccountVerification />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
