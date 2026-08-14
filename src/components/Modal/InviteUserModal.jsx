/**
 * InviteUserModal
 * Dialog để invite user vào board theo email
 *
 * Features:
 * - Nhập email → Debounce search 600ms → Preview user card
 * - Confirm invite → POST /v1/invitations/board
 * - Emit socket đến người được invite (xử lý ở backend)
 * - Toast thành công / lỗi
 */
import { useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import SearchIcon from '@mui/icons-material/Search'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InputAdornment from '@mui/material/InputAdornment'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// Debounce đơn giản không cần thư viện
let debounceTimer = null
const debounce = (fn, delay) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fn, delay)
}

function InviteUserModal({ open, onClose, board }) {
  const dispatch = useDispatch()

  const [emailValue, setEmailValue] = useState('')
  const [foundUser, setFoundUser] = useState(null) // user tìm được
  const [notFound, setNotFound] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isInviting, setIsInviting] = useState(false)
  const [invitedSuccess, setInvitedSuccess] = useState(false)

  // Reset state khi đóng modal
  const handleClose = () => {
    setEmailValue('')
    setFoundUser(null)
    setNotFound(false)
    setInvitedSuccess(false)
    onClose()
  }

  // Tìm user theo email
  const searchUser = useCallback(async (email) => {
    if (!email || !email.includes('@')) {
      setFoundUser(null)
      setNotFound(false)
      return
    }
    setIsSearching(true)
    try {
      const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/v1/users/search?email=${encodeURIComponent(email.trim())}`
      )
      const users = response.data
      if (users && users.length > 0) {
        setFoundUser(users[0])
        setNotFound(false)
      } else {
        setFoundUser(null)
        setNotFound(true)
      }
    } catch {
      setFoundUser(null)
      setNotFound(false)
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmailValue(value)
    setFoundUser(null)
    setNotFound(false)
    setInvitedSuccess(false)

    // Debounce search 600ms
    debounce(() => searchUser(value), 600)
  }

  // Gửi invitation
  const handleInvite = async () => {
    if (!foundUser || !board?._id) return
    setIsInviting(true)
    try {
      await authorizedAxiosInstance.post(`${API_ROOT}/v1/invitations/board`, {
        inviteeEmail: foundUser.email,
        boardId: board._id
      })
      setInvitedSuccess(true)
      toast.success(`Đã gửi lời mời đến ${foundUser.displayName || foundUser.email}!`)
    } catch (error) {
      // Error đã được toast bởi axios interceptor
    } finally {
      setIsInviting(false)
    }
  }

  // Kiểm tra user đã là member chưa
  const isAlreadyMember = foundUser && (
    board?.owners?.some((o) => o.email === foundUser.email) ||
    board?.members?.some((m) => m.email === foundUser.email)
  )

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          overflow: 'hidden'
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 2, // Thêm padding xung quanh tiêu đề
          bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0',
          color: 'white'
        }}
      >
        <PersonAddIcon />
        <Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            Mời thành viên
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85, display: 'block', mt: 0.5 }}>
            Board: {board?.title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: '24px !important', pb: 1 }}>
        {/* Email input */}
        <TextField
          autoFocus
          fullWidth
          label="Nhập email người dùng"
          type="email"
          size="small"
          value={emailValue}
          onChange={handleEmailChange}
          placeholder="example@email.com"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {isSearching
                  ? <CircularProgress size={16} />
                  : <SearchIcon fontSize="small" color="action" />
                }
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />

        {/* User not found */}
        {notFound && !isSearching && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 1 }}>
            Không tìm thấy người dùng với email này, hoặc tài khoản chưa được xác minh.
          </Alert>
        )}

        {/* Already member */}
        {isAlreadyMember && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: 1 }}>
            Người này đã là thành viên của board.
          </Alert>
        )}

        {/* Invite success */}
        {invitedSuccess && (
          <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2, borderRadius: 1 }}>
            Lời mời đã được gửi thành công!
          </Alert>
        )}

        {/* Found user preview */}
        {foundUser && !isAlreadyMember && (
          <Box>
            <Divider sx={{ mb: 2 }}>
              <Chip label="Người dùng tìm thấy" size="small" />
            </Divider>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                borderRadius: 1,
                border: '2px solid',
                borderColor: 'primary.main',
                bgcolor: 'primary.50'
              }}
            >
              <Avatar
                src={foundUser.avatar}
                alt={foundUser.displayName}
                sx={{ width: 44, height: 44 }}
              >
                {foundUser.displayName?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Box flex={1}>
                <Typography variant="body2" fontWeight={700}>
                  {foundUser.displayName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {foundUser.email}
                </Typography>
              </Box>
              <Chip
                size="small"
                label="Đã xác minh"
                color="success"
                sx={{ fontSize: '10px' }}
              />
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={handleClose}
          color="inherit"
          variant="outlined"
          sx={{ borderRadius: 1 }}
        >
          Đóng
        </Button>
        <Button
          variant="contained"
          startIcon={isInviting ? <CircularProgress size={16} color="inherit" /> : <PersonAddIcon />}
          disabled={!foundUser || isAlreadyMember || isInviting || invitedSuccess}
          onClick={handleInvite}
          sx={{
            borderRadius: 1,
            fontWeight: 500,
          }}
        >
          {invitedSuccess ? 'Đã gửi' : 'Gửi lời mời'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default InviteUserModal
