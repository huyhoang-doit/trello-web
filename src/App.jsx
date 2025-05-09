import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Board from '~/pages/Boards/Boards'
import NotFound from './pages/404/NotFound'
import Auth from './pages/Auth/Auth'
import AccountVerification from './pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to="/login" replace={true} />
  }
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to="/boards/66c14c41622f69315ca4e6f1" replace={true} />
        }
      />

      <Route element={<ProtectedRoute user={currentUser} />}>
        {/* Board Details */}
        <Route path="/boards/:boardId" element={<Board />} />
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
