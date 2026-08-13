/**
 * BoardInfoSection - Hiển thị thông tin board ở phần trên sidebar
 */
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PublicIcon from '@mui/icons-material/Public'
import LockIcon from '@mui/icons-material/Lock'
import GroupIcon from '@mui/icons-material/Group'

function BoardInfoSection({ board }) {
  const allMembers = [
    ...(board?.members || [])
  ]

  const getAvatarColor = (email = '') =>
    `hsl(${email.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360}, 55%, 48%)`

  return (
    <Box sx={{ px: 2, py: 1.5 }}>
      {/* Board Icon + Title */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <DashboardIcon sx={{ color: 'white', fontSize: 22 }} />
        </Box>
        <Box flex={1} minWidth={0}>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            noWrap
            title={board?.title}
          >
            {board?.title}
          </Typography>
          <Chip
            size="small"
            icon={board?.type === 'public' ? <PublicIcon /> : <LockIcon />}
            label={board?.type === 'public' ? 'Public' : 'Private'}
            variant="outlined"
            sx={{ fontSize: '10px', height: '20px', mt: 0.3 }}
          />
        </Box>
      </Box>

      {/* Description */}
      {board?.description && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            mb: 1.5,
            lineHeight: 1.5,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {board.description}
        </Typography>
      )}

      <Divider sx={{ mb: 1.5 }} />

      {/* Members */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <GroupIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {allMembers.length} thành viên
          </Typography>
        </Box>
        <AvatarGroup
          max={5}
          sx={{
            '& .MuiAvatar-root': {
              width: 26,
              height: 26,
              fontSize: '11px',
              border: '1.5px solid white'
            }
          }}
        >
          {allMembers.map((m) => (
            <Tooltip key={m._id} title={m.displayName || m.email}>
              <Avatar
                src={m.avatar}
                alt={m.displayName}
                sx={{ bgcolor: !m.avatar ? getAvatarColor(m.email) : undefined }}
              >
                {!m.avatar && (m.displayName?.charAt(0) || m.email?.charAt(0))?.toUpperCase()}
              </Avatar>
            </Tooltip>
          ))}
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardInfoSection
