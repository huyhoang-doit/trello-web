/**
 * CommentItem - Hiển thị một comment trong board sidebar
 */
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import moment from 'moment/min/moment-with-locales'

function CommentItem({ comment, isSelf }) {
  const { userInfo, content, createdAt } = comment

  // Tạo màu avatar dựa trên email (consistent color per user)
  const avatarColor = `hsl(${
    (userInfo?.email || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  }, 55%, 48%)`

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isSelf ? 'row-reverse' : 'row',
        gap: 1,
        mb: 1.5,
        alignItems: 'flex-start',
        '&:hover .comment-time': { opacity: 1 }
      }}
    >
      {/* Avatar */}
      <Tooltip title={userInfo?.displayName || userInfo?.email} placement={isSelf ? 'right' : 'left'}>
        <Avatar
          src={userInfo?.avatar}
          alt={userInfo?.displayName}
          sx={{
            width: 30,
            height: 30,
            fontSize: '12px',
            flexShrink: 0,
            mt: 0.3,
            bgcolor: !userInfo?.avatar ? avatarColor : undefined
          }}
        >
          {!userInfo?.avatar &&
            (userInfo?.displayName?.charAt(0) || userInfo?.email?.charAt(0))?.toUpperCase()}
        </Avatar>
      </Tooltip>

      {/* Bubble */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: isSelf ? 'flex-end' : 'flex-start' }}>
        {/* Name + time */}
        <Box sx={{ display: 'flex', flexDirection: isSelf ? 'row-reverse' : 'row', alignItems: 'baseline', gap: 0.8, mb: 0.3 }}>
          <Typography
            variant="caption"
            fontWeight={700}
            sx={{
              color: 'text.primary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '120px'
            }}
          >
            {isSelf ? 'Bạn' : (userInfo?.displayName || userInfo?.email?.split('@')[0])}
          </Typography>
          <Typography
            className="comment-time"
            variant="caption"
            color="text.disabled"
            sx={{ fontSize: '10px', opacity: 0.7, transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}
          >
            {moment(createdAt).locale('vi').fromNow()}
          </Typography>
        </Box>

        {/* Content bubble */}
        <Box
          sx={{
            display: 'inline-block',
            bgcolor: (theme) => {
              if (isSelf) {
                return theme.palette.mode === 'dark' ? '#1976d2' : '#e3f2fd'
              }
              return theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(0,0,0,0.05)'
            },
            color: (theme) => {
              if (isSelf && theme.palette.mode !== 'dark') {
                return '#0d47a1' // Chữ xanh đậm dễ đọc trên nền xanh nhạt
              }
              return 'inherit'
            },
            borderRadius: isSelf ? '12px 0 12px 12px' : '0 12px 12px 12px',
            px: 1.5,
            py: 0.8,
            maxWidth: '100%',
            wordBreak: 'break-word',
            border: (theme) => {
              if (isSelf && theme.palette.mode !== 'dark') {
                return '1px solid #bbdefb'
              }
              return 'none'
            }
          }}
        >
          <Typography variant="body2" sx={{ lineHeight: 1.45, fontSize: '13px' }}>
            {content}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default CommentItem
