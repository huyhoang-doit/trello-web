import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'



const MENU_STYLES = {
  color: 'primary.main',
  borderColor: 'white',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'primary.main'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}
function BoardBar() {
  return (
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
        borderTop: '1px solid #00bfa5'
      }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label="HuyHoang-DoIt Board"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label="Public/Private Workspace"
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="outlined" startIcon={<PersonAddIcon />}>Invite</Button>
        <AvatarGroup
          max={7}
          sx={{
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: '16px'
            }
          }
          }
        >
          <Tooltip title='HuyHoang-doit'>
            <Avatar
              alt="huyhoang-doit"
              src="https://samkyvuong.vn/wp-content/uploads/2022/05/girl-xinh.jpg.webp" />
          </Tooltip>
          <Tooltip title='HuyHoang-doit'>
            <Avatar
              alt="huyhoang-doit"
              src="https://luv.vn/wp-content/uploads/2022/07/gai-tay-dep-37.jpg" />
          </Tooltip>
          <Tooltip title='HuyHoang-doit'>
            <Avatar
              alt="huyhoang-doit"
              src="https://samkyvuong.vn/wp-content/uploads/2022/05/gai-tay-lanh-lung.jpg.webp" />
          </Tooltip>
          <Tooltip title='HuyHoang-doit'>
            <Avatar
              alt="huyhoang-doit"
              src="https://kenh14cdn.com/2018/10/1/screen-shot-2018-10-01-at-95956-pm-15384061286081927130003.png" />
          </Tooltip>
          <Tooltip title='HuyHoang-doit'>
            <Avatar
              alt="huyhoang-doit"
              src="https://cdn.mozart.edu.vn/wp-content/uploads/2024/04/hinh-gai-dep-goi-cam-1.jpg" />
          </Tooltip>
          <Tooltip title='HuyHoang-doit'>
            <Avatar
              alt="huyhoang-doit"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_lSLxbc54btHJlYfrHfQR9j4p8eXr8DQVU5zmxCpOCkczXKnKnq5_kUuT7rRhrVWAqwY&usqp=CAU" />
          </Tooltip>
          <Tooltip title='HuyHoang-doit'>
            <Avatar
              alt="huyhoang-doit"
              src="https://cdn.mozart.edu.vn/wp-content/uploads/2024/04/hinh-gai-dep-goi-cam-1.jpg" />
          </Tooltip>
          <Tooltip title='HuyHoang-doit'>
            <Avatar
              alt="huyhoang-doit"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_lSLxbc54btHJlYfrHfQR9j4p8eXr8DQVU5zmxCpOCkczXKnKnq5_kUuT7rRhrVWAqwY&usqp=CAU" />
          </Tooltip>
          <Tooltip title='HuyHoang-doit'>
            <Avatar
              alt="huyhoang-doit"
              src="https://cdn.mozart.edu.vn/wp-content/uploads/2024/04/hinh-gai-dep-goi-cam-1.jpg" />
          </Tooltip>
          <Tooltip title='HuyHoang-doit'>
            <Avatar
              alt="huyhoang-doit"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_lSLxbc54btHJlYfrHfQR9j4p8eXr8DQVU5zmxCpOCkczXKnKnq5_kUuT7rRhrVWAqwY&usqp=CAU" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box >
  )
}

export default BoardBar
