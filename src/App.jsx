import { Routes, Route, Navigate } from 'react-router-dom'
import Board from '~/pages/Boards/Boards'
import NotFound from './pages/404/NotFound'
import Auth from './pages/Auth/Auth'
import AccountVerification from './pages/Auth/AccountVerification'
function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to="/boards/66c14c41622f69315ca4e6f1" replace={true} />
        }
      />

      {/* Board Details */}
      <Route path="/boards/:boardId" element={<Board />} />

      {/* Authentication */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verify-email" element={<AccountVerification />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
