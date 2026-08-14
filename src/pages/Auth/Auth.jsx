import { useLocation, Navigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import loginBg from '~/assets/auth/login-register-bg.jpg'
import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'

function Auth() {
  const location = useLocation()
  const isLogin = location.pathname === '/login'
  const isRegister = location.pathname === '/register'

  const currentUser = useSelector(selectCurrentUser)
  if (currentUser) {
    return <Navigate to="/" replace={true} />
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Cột bên trái: Auth Form Container */}
      <Box
        sx={{
          flex: { xs: '1 1 100%', md: '0 0 45%', lg: '0 0 40%' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 4 },
          py: 4,
          // Nền gradient chuyển động nhẹ tạo chiều sâu cho cột bên trái
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1e2d3d 0%, #111a24 100%)'
            : 'linear-gradient(135deg, #f5f7fa 0%, #e4ecf7 100%)',
          boxShadow: 3,
          zIndex: 2,
          overflowY: 'auto'
        }}
      >
        {/* Card thủy tinh mờ (Glassmorphism Card) bọc quanh Form */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '400px',
            p: { xs: 3, sm: 4 },
            borderRadius: 1,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(30, 45, 61, 0.45)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.7)',
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
              : '0 8px 32px 0 rgba(31, 38, 135, 0.08)'
          }}
        >
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
            <SvgIcon
              component={TrelloIcon}
              fontSize="large"
              inheritViewBox
              sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4', width: '36px', height: '36px' }}
            />
            <Typography variant="h5" fontWeight={800} sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#0c66e4', tracking: '0.05em' }}>
              Trello Clone
            </Typography>
          </Box>

          {/* Form */}
          {isLogin && <LoginForm />}
          {isRegister && <RegisterForm />}
        </Box>
      </Box>

      {/* Cột bên phải: Visual Section */}
      <Box
        sx={{
          flex: { xs: '0', md: '1 1 55%', lg: '1 1 60%' },
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          p: 8,
          position: 'relative',
          background: `url("${loginBg}")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          zIndex: 1
        }}
      >
        <Box sx={{ maxWidth: '640px' }}>
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              mb: 2,
              lineHeight: 1.2,
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            Quản lý công việc và cộng tác nhóm dễ dàng hơn
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.85,
              fontWeight: 400,
              lineHeight: 1.6,
              mb: 4
            }}
          >
            Trello giúp các nhóm thúc đẩy tiến độ công việc. Cộng tác, quản lý dự án và đạt đến đỉnh cao năng suất mới theo cách riêng của bạn.
          </Typography>
        </Box>

        {/* Dynamic shape decoration */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
            pointerEvents: 'none'
          }}
        />
      </Box>
    </Box>
  )
}

export default Auth
