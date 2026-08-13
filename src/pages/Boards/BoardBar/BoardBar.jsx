import { useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Button from '@mui/material/Button'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatter'
import InviteUserModal from '~/components/Modal/InviteUserModal'

const MENU_STYLES = {
  color: 'white',
  borderColor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': { color: 'white' },
  '&:hover': { bgcolor: 'primary.50' }
}

function BoardBar({ board }) {
  const [openInviteModal, setOpenInviteModal] = useState(false)

  // Gộp owners và members để hiển thị AvatarGroup
  const boardMembers = [
    ...(board?.owners || []),
    ...(board?.members || [])
  ]

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: (theme) => theme.trello.boardBarHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          paddingX: 2,
          overflowX: 'auto',
          '&::-webkit-scrollbar-track': { m: 2 },
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          borderBottom: '1px solid white'
        }}
      >
        {/* Left side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title={board?.description}>
            <Chip
              sx={MENU_STYLES}
              icon={<DashboardIcon />}
              label={board?.title}
              clickable
            />
          </Tooltip>
          <Chip
            sx={MENU_STYLES}
            icon={<VpnLockIcon />}
            label={capitalizeFirstLetter(board?.type)}
            clickable
          />
          <Chip
            sx={MENU_STYLES}
            icon={<AddToDriveIcon />}
            label="Add To Google Drive"
            clickable
          />
          <Chip
            sx={MENU_STYLES}
            icon={<OfflineBoltIcon />}
            label="Automation"
            clickable
          />
          <Chip
            sx={MENU_STYLES}
            icon={<FilterListIcon />}
            label="Filters"
            clickable
          />
        </Box>

        {/* Right side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={() => setOpenInviteModal(true)}
            sx={{
              color: 'white',
              borderColor: 'white',
              whiteSpace: 'nowrap',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Invite
          </Button>

          {/* Avatar Group - hiển thị real members từ API */}
          <AvatarGroup
            max={7}
            sx={{
              '& .MuiAvatar-root': {
                width: 34,
                height: 34,
                fontSize: '14px',
                border: '2px solid white',
                cursor: 'pointer',
                '&:first-of-type': { bgcolor: '#a4b0be' }
              }
            }}
          >
            {boardMembers.map((member) => (
              <Tooltip key={member._id} title={member.displayName || member.email}>
                <Avatar
                  alt={member.displayName}
                  src={member.avatar}
                  sx={{
                    bgcolor: !member.avatar
                      ? `hsl(${member.email?.charCodeAt(0) * 5 % 360}, 60%, 50%)`
                      : undefined
                  }}
                >
                  {!member.avatar && (member.displayName?.charAt(0) || member.email?.charAt(0))?.toUpperCase()}
                </Avatar>
              </Tooltip>
            ))}
          </AvatarGroup>
        </Box>
      </Box>

      {/* Invite Modal */}
      <InviteUserModal
        open={openInviteModal}
        onClose={() => setOpenInviteModal(false)}
        board={board}
      />
    </>
  )
}

export default BoardBar
