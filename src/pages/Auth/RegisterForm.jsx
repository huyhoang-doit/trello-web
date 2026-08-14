import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useForm } from 'react-hook-form'
import {
  EMAIL_RULE,
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  EMAIL_RULE_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { registerUserAPI } from '~/apis'
import { toast } from 'react-toastify'

function RegisterForm() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const submitRegister = (data) => {
    const { email, password } = data
    toast
      .promise(registerUserAPI({ email, password }), {
        pending: 'Đang đăng ký tài khoản...'
      })
      .then((user) => {
        navigate(`/login?registeredEmail=${user.email}`)
      })
  }

  const toggleShowPassword = () => setShowPassword(!showPassword)
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

  return (
    <form onSubmit={handleSubmit(submitRegister)} style={{ width: '100%' }}>
      <Box sx={{ mb: 2.5, textAlign: 'center' }}>
        <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5, color: 'text.primary' }}>
          Đăng ký tài khoản
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Bắt đầu hành trình quản lý công việc hiệu quả
        </Typography>
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

        <Box>
          <TextField
            fullWidth
            label="Xác nhận mật khẩu"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="outlined"
            placeholder="••••••••"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CheckCircleOutlineIcon fontSize="small" sx={{ color: 'primary.main' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowConfirmPassword} edge="end" size="small">
                    {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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
            error={!!errors['password_confirmation']}
            {...register('password_confirmation', {
              required: FIELD_REQUIRED_MESSAGE,
              validate: (value) =>
                value === watch('password') ||
                'Mật khẩu xác nhận không khớp!'
            })}
          />
          <FieldErrorAlert
            errors={errors}
            fieldName={'password_confirmation'}
          />
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
          Đăng ký
        </Button>
      </Box>

      {/* Divider / Link */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" display="inline">
          Đã có tài khoản?{' '}
        </Typography>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <Typography
            variant="body2"
            component="span"
            fontWeight={700}
            sx={{
              color: 'primary.main',
              '&:hover': { color: 'primary.dark', textDecoration: 'underline' }
            }}
          >
            Đăng nhập ngay
          </Typography>
        </Link>
      </Box>
    </form>
  )
}

export default RegisterForm
