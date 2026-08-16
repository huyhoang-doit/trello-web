/**
 * BoardSidebar
 * Sidebar bên phải của board detail page
 * Mặc định ĐÓNG khi vào trang, user click toggle để mở
 *
 * Layout:
 * ┌─────────────────────┐
 * │ [Toggle Button] ←   │
 * ├─────────────────────┤
 * │ BoardInfoSection    │  (thông tin board + members)
 * ├─────────────────────┤
 * │ BoardCommentSection │  (chat/comment realtime, flex:1)
 * └─────────────────────┘
 */
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ForumIcon from '@mui/icons-material/Forum'
import BoardInfoSection from './BoardInfoSection'
import BoardCommentSection from './BoardCommentSection'
import { joinBoardRoom, leaveBoardRoom } from '~/utils/socket'

const SIDEBAR_WIDTH = 300

function BoardSidebar({ board }) {
  const [open, setOpen] = useState(true) // Mặc định ĐÓNG

  // Join/leave board socket room khi component mount/unmount
  useEffect(() => {
    if (board?._id) {
      joinBoardRoom(board._id)
    }
    return () => {
      if (board?._id) {
        leaveBoardRoom(board._id)
      }
    }
  }, [board?._id])

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        height: '100%'
      }}
    >
      {/* Toggle Button — luôn hiển thị */}
      <Box
        sx={{
          position: 'absolute',
          left: open ? SIDEBAR_WIDTH - 18 : -18,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          transition: 'left 0.25s ease'
        }}
      >
        <Tooltip title={open ? 'Đóng sidebar' : 'Mở chat & thông tin board'} placement="left">
          <IconButton
            onClick={() => setOpen(!open)}
            size="small"
            sx={{
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
              color: 'white',
              width: 28,
              height: 28,
              border: '2px solid white',
              boxShadow: 2,
              '&:hover': {
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0'
              }
            }}
          >
            {open ? (
              <ChevronRightIcon sx={{ fontSize: 18 }} />
            ) : (
              <ChevronLeftIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Sidebar Panel */}
      <Box
        sx={{
          width: open ? SIDEBAR_WIDTH : 0,
          minWidth: open ? SIDEBAR_WIDTH : 0,
          overflow: 'hidden',
          transition: 'width 0.25s ease, min-width 0.25s ease',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#1e2a35' : '#f8f9fa',
          borderLeft: open ? '1px solid' : 'none',
          borderColor: 'divider'
        }}
      >
        {/* Chỉ render nội dung khi mở (tránh fetch không cần thiết) */}
        {open && (
          <Box
            sx={{
              width: SIDEBAR_WIDTH,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <Box
              sx={{
                px: 2,
                py: 1.2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark' ? '#2c3e50' : '#1976d2',
                color: 'white',
                flexShrink: 0
              }}
            >
              <ForumIcon sx={{ fontSize: 18 }} />
              <Typography variant="subtitle2" fontWeight={700}>
                Board
              </Typography>
            </Box>

            {/* Board Info - phần trên */}
            <BoardInfoSection board={board} />

            <Divider />

            {/* Comment Section - phần dưới, chiếm phần còn lại */}
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <BoardCommentSection boardId={board?._id} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default BoardSidebar
