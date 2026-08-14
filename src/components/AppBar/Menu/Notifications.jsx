/**
 * Notification Bell với Dropdown Menu
 * Hiển thị danh sách board invitations với khả năng Accept/Decline
 *
 * Features:
 * - Badge hiển thị số thông báo chưa đọc (pending)
 * - Dropdown với danh sách notifications
 * - Accept/Decline invitation trực tiếp
 * - Real-time update qua Socket.IO
 */
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import Avatar from '@mui/material/Avatar'
import moment from 'moment/min/moment-with-locales'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectCurrentNotifications,
  fetchInvitationsAPI,
  updateBoardInvitationAPI,
  addNotification
} from '~/redux/notifications/notificationSlice'
import { getSocket } from '~/utils/socket'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

// Status badge chip
const InvitationStatusChip = ({ status }) => {
  if (status === 'accepted') {
    return (
      <Chip
        size="small"
        icon={<CheckCircleOutlineIcon />}
        label="Đã chấp nhận"
        color="success"
        variant="outlined"
        sx={{ fontSize: '11px', height: '22px' }}
      />
    )
  }
  if (status === 'declined') {
    return (
      <Chip
        size="small"
        icon={<HighlightOffIcon />}
        label="Đã từ chối"
        color="error"
        variant="outlined"
        sx={{ fontSize: '11px', height: '22px' }}
      />
    )
  }
  return null
}

function Notifications() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const notifications = useSelector(selectCurrentNotifications)

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  // Đếm số notification chưa xử lý (pending)
  const pendingCount = (notifications || []).filter(
    (n) => n?.boardInvitation?.status === 'pending'
  ).length

  // Fetch notifications khi mở dropdown lần đầu
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchInvitationsAPI())
    }
  }, [currentUser, dispatch])

  // Lắng nghe real-time notification từ socket
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleNewNotification = (notification) => {
      dispatch(addNotification(notification))
    }

    socket.on('FE_RECEIVE_NOTIFICATION', handleNewNotification)

    return () => {
      socket.off('FE_RECEIVE_NOTIFICATION', handleNewNotification)
    }
  }, [dispatch])

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleUpdateInvitation = (invitationId, status, boardId) => {
    dispatch(updateBoardInvitationAPI({ invitationId, status })).then((result) => {
      // Nếu accept thì navigate tới board đó
      if (status === 'accepted' && result?.payload?.boardInvitation?.status === 'accepted') {
        navigate(`/boards/${boardId}`)
        handleCloseMenu()
      }
    })
  }

  return (
    <Box>
      <Tooltip title="Thông báo">
        <Badge
          badgeContent={pendingCount}
          color="warning"
          sx={{
            cursor: 'pointer',
            '& .MuiBadge-badge': {
              fontSize: '10px',
              minWidth: '16px',
              height: '16px'
            }
          }}
          onClick={handleOpenMenu}
        >
          {pendingCount > 0
            ? <NotificationsIcon sx={{ color: 'white' }} />
            : <NotificationsNoneIcon sx={{ color: 'white' }} />
          }
        </Badge>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          elevation: 4,
          sx: {
            width: 360,
            maxHeight: 480,
            overflowY: 'auto',
            mt: 1,
            borderRadius: '12px',
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-thumb': {
              borderRadius: '10px',
              bgcolor: 'rgba(0,0,0,0.15)'
            }
          }
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Thông báo
          </Typography>
          {pendingCount > 0 && (
            <Chip
              size="small"
              label={`${pendingCount} chưa đọc`}
              color="warning"
              sx={{ fontSize: '11px' }}
            />
          )}
        </Box>
        <Divider />

        {/* Loading state */}
        {notifications === null && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={28} />
          </Box>
        )}

        {/* Empty state */}
        {Array.isArray(notifications) && notifications.length === 0 && (
          <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
            <NotificationsNoneIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Bạn chưa có thông báo nào
            </Typography>
          </Box>
        )}

        {/* Notification list */}
        {Array.isArray(notifications) && notifications.map((notification, index) => {
          const isPending = notification?.boardInvitation?.status === 'pending'
          const inviter = notification?.inviter
          const board = notification?.board
          const boardId = notification?.boardInvitation?.boardId

          return (
            <MenuItem
              key={notification._id || index}
              sx={{
                py: 1.5,
                px: 2,
                alignItems: 'flex-start',
                gap: 1.5,
                bgcolor: isPending ? 'action.hover' : 'transparent',
                '&:hover': { bgcolor: 'action.selected' }
              }}
            >
              {/* Avatar của người invite */}
              <Avatar
                src={inviter?.avatar}
                alt={inviter?.displayName}
                sx={{ width: 38, height: 38, mt: 0.5, flexShrink: 0 }}
              >
                {inviter?.displayName?.charAt(0)?.toUpperCase()}
              </Avatar>

              {/* Nội dung notification */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Tooltip
                  title={`${inviter?.displayName || inviter?.email || 'Người dùng'} đã mời bạn tham gia board "${board?.title || 'Bảng'}"`}
                  placement="top"
                  arrow
                >
                  <Typography
                    variant="body2"
                    sx={{
                      lineHeight: 1.4,
                      mb: 0.5,
                      whiteSpace: 'normal', // Ép text tự xuống dòng
                      wordBreak: 'break-word' // Tránh lỗi từ dài làm tràn dòng
                    }}
                  >
                    <Typography
                      component="span"
                      variant="body2"
                      fontWeight={700}
                    >
                      {inviter?.displayName || inviter?.email}
                    </Typography>
                    {' '}đã mời bạn tham gia board{' '}
                    <Typography
                      component="span"
                      variant="body2"
                      fontWeight={700}
                      color="primary.main"
                    >
                      "{board?.title}"
                    </Typography>
                  </Typography>
                </Tooltip>

                {/* Timestamp */}
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  {moment(notification.createdAt).locale('vi').fromNow()}
                </Typography>

                {/* Action buttons hoặc status chip */}
                {isPending ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      sx={{ fontSize: '12px', py: 0.3, textTransform: 'none', borderRadius: '6px' }}
                      startIcon={<CheckCircleOutlineIcon fontSize="small" />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUpdateInvitation(notification._id, 'accepted', boardId)
                      }}
                    >
                      Chấp nhận
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      sx={{ fontSize: '12px', py: 0.3, textTransform: 'none', borderRadius: '6px' }}
                      startIcon={<HighlightOffIcon fontSize="small" />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUpdateInvitation(notification._id, 'declined', boardId)
                      }}
                    >
                      Từ chối
                    </Button>
                  </Box>
                ) : (
                  <InvitationStatusChip status={notification?.boardInvitation?.status} />
                )}
              </Box>
            </MenuItem>
          )
        })}

        {/* Footer icon */}
        {Array.isArray(notifications) && notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ py: 1, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                <GroupAddIcon fontSize="small" />
                Lời mời tham gia board
              </Typography>
            </Box>
          </>
        )}
      </Menu>
    </Box>
  )
}

export default Notifications
