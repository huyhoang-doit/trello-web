import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useForm } from 'react-hook-form'
import {
  EMAIL_RULE,
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  EMAIL_RULE_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useDispatch } from 'react-redux'
import { loginUserAPI } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'

function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  let [searchParams] = useSearchParams()
  const verifiedEmail = searchParams.get('verifiedEmail')
  const registeredEmail = searchParams.get('registeredEmail')

  const submitLogIn = (data) => {
    const { email, password } = data
    toast
      .promise(dispatch(loginUserAPI({ email, password })), {
        pending: 'Đang đăng nhập...'
      })
      .then((res) => {
        if (!res.error) {
          navigate('/')
        }
      })
  }

  const toggleShowPassword = () => setShowPassword(!showPassword)

  return (
    <form onSubmit={handleSubmit(submitLogIn)} style={{ width: '100%' }}>
      <Box sx={{ mb: 2.5, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5, color: 'text.primary' }}>
          Đăng nhập
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Quản lý bảng công việc của bạn một cách nhanh chóng
        </Typography>
      </Box>

      {/* Mockdata hiển thị để tiện copy */}
      <Box
        sx={{
          mb: 2.5,
          p: 1.5,
          borderRadius: 1, // 8px (hoặc mặc định theme)
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(12, 102, 228, 0.04)',
          border: '1px dashed',
          borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#90caf9',
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" fontSize="11px" fontWeight={600} color="text.primary">
          Email: <span style={{ color: '#0c66e4' }}>huyhoangdoit.171@gmail.com</span>
        </Typography>
        <Typography variant="body2" fontSize="11px" fontWeight={600} color="text.primary" sx={{ mt: 0.5 }}>
          Password: <span style={{ color: '#0c66e4' }}>Huyho@ng123</span>
        </Typography>
      </Box>

      {/* Alerts */}
      <Box sx={{ mb: 2 }}>
        {verifiedEmail && (
          <Alert severity="success">
            Email của bạn <strong>{verifiedEmail}</strong> đã được xác thực thành công. Vui lòng đăng nhập!
          </Alert>
        )}
        {registeredEmail && (
          <Alert severity="info">
            Thư xác thực đã được gửi tới <strong>{registeredEmail}</strong>. Vui lòng kiểm tra email trước khi đăng nhập!
          </Alert>
        )}
      </Box>

      {/* Input Fields */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box>
          <TextField
            fullWidth
            label="Email"
            type="text"
            variant="outlined"
            placeholder="example@email.com"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon fontSize="small" sx={{ color: 'primary.main' }} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  boxShadow: '0 0 8px rgba(12, 102, 228, 0.25)'
                }
              }
            }}
            error={!!errors['email']}
            {...register('email', {
              required: FIELD_REQUIRED_MESSAGE,
              pattern: {
                value: EMAIL_RULE,
                message: EMAIL_RULE_MESSAGE
              }
            })}
          />
          <FieldErrorAlert errors={errors} fieldName={'email'} />
        </Box>

        <Box>
          <TextField
            fullWidth
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            placeholder="••••••••"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon fontSize="small" sx={{ color: 'primary.main' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword} edge="end" size="small">
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  boxShadow: '0 0 8px rgba(12, 102, 228, 0.25)'
                }
              }
            }}
            error={!!errors['password']}
            {...register('password', {
              required: FIELD_REQUIRED_MESSAGE,
              pattern: {
                value: PASSWORD_RULE,
                message: PASSWORD_RULE_MESSAGE
              }
            })}
          />
          <FieldErrorAlert errors={errors} fieldName={'password'} />
        </Box>

        <Button
          className="interceptor-loading"
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          sx={{
            py: 1.3,
            textTransform: 'none',
            fontSize: '15px',
            fontWeight: 800,
            boxShadow: 'none',
            '&:hover': { 
              boxShadow: 'none',
              bgcolor: 'primary.dark'
            }
          }}
        >
          Đăng nhập
        </Button>
      </Box>

      {/* Divider / Link */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" display="inline">
          Chưa có tài khoản?{' '}
        </Typography>
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <Typography
            variant="body2"
            component="span"
            fontWeight={700}
            sx={{
              color: 'primary.main',
              '&:hover': { color: 'primary.dark', textDecoration: 'underline' }
            }}
          >
            Đăng ký ngay
          </Typography>
        </Link>
      </Box>
    </form>
  )
}

export default LoginForm
