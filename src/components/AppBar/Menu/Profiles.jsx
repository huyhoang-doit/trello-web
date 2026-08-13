import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import { useState } from 'react'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUserAPI, selectCurrentUser } from '~/redux/user/userSlice'
import { useConfirm } from 'material-ui-confirm'
import { Link } from 'react-router-dom'

const Profiles = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const confirmLogout = useConfirm()
  const handleLogout = () => {
    confirmLogout({
      title: 'Logout',
      description: 'Are you sure you want to logout?',
      confirmationText: 'Logout',
      cancellationText: 'Cancel'
    }).then(()=> {
      dispatch(logoutUserAPI(true))
    })
  }
  return (
    <Box>
      <Tooltip title="Profiles">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? 'basic-menu-profiles' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: 34, height: 34 }}
            src={currentUser?.avatar || 'https://avatars.githubusercontent.com/u/139938101?v=4'}
            alt="huyhoang-doit"
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profiles'
        }}
      >

        <Link to={'/settings/account'}>
          <MenuItem sx={{
            '&:hover': {
              color: 'success.light'
            }
          }}>
            <Avatar sx={{ width: 28, height: 28, marginRight: 2 }}  src={currentUser?.avatar}/> Profile
          </MenuItem>
        </Link>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem sx={{
          '&:hover': {
            color: 'warning.dark',
            '& .logout-icon': {
              color: 'warning.dark'
            }
          }
        }} 
        onClick={handleLogout}
        >
          <ListItemIcon>
            <Logout fontSize="small" className='logout-icon'/>
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profiles
