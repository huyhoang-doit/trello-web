import { useState, useEffect } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import ListAltIcon from '@mui/icons-material/ListAlt'
import HomeIcon from '@mui/icons-material/Home'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import PublicIcon from '@mui/icons-material/Public'
import LockIcon from '@mui/icons-material/Lock'
import GroupIcon from '@mui/icons-material/Group'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import Tooltip from '@mui/material/Tooltip'
import { Link, useLocation } from 'react-router-dom'
import SidebarCreateBoardModal from './create'
import { fetchBoardsApi } from '~/apis'
import { styled } from '@mui/material/styles'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'
import moment from 'moment'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 18px',
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#2c3e50' : theme.palette.grey[200]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : '#e9f2ff',
    fontWeight: 700
  }
}))

function Boards() {
  const [boards, setBoards] = useState(null)
  const [totalBoards, setTotalBoards] = useState(null)
  const location = useLocation()
  
  const query = new URLSearchParams(location.search)
  const page = parseInt(query.get('page') || '1', 10)

  const refreshBoards = () => {
    fetchBoardsApi(location.search).then((data) => {
      setBoards(data.boards || [])
      setTotalBoards(data.totalBoards || 0)
    })
  }

  useEffect(() => {
    refreshBoards()
  }, [location.search])

  if (!boards) {
    return <PageLoadingSpinner caption="Đang tải danh sách bảng..." />
  }

  const getGradientColor = (title = '') => {
    const code = title.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    const angle = code % 360
    return `linear-gradient(${angle}deg, #1565c0 0%, #00d2ff 100%)`
  }

  return (
    <Container 
      disableGutters 
      maxWidth={false} 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#121212' : '#f4f6f8' 
      }}
    >
      <AppBar />
      
      {/* Vùng Content chính */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: 4, flex: 1 }}>
        <Grid container spacing={3}>
          {/* Cột trái: Sidebar */}
          <Grid xs={12} sm={4} md={3}>
            <Stack direction="column" spacing={1.5}>
              <SidebarItem className="active">
                <SpaceDashboardIcon fontSize="small" />
                <Typography variant="body2" fontWeight={600}>Bảng làm việc</Typography>
              </SidebarItem>
              <SidebarItem>
                <ListAltIcon fontSize="small" />
                <Typography variant="body2" fontWeight={600}>Mẫu có sẵn</Typography>
              </SidebarItem>
              <SidebarItem>
                <HomeIcon fontSize="small" />
                <Typography variant="body2" fontWeight={600}>Trang chủ</Typography>
              </SidebarItem>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack direction="column">
              <SidebarCreateBoardModal afterCreateBoard={refreshBoards} />
            </Stack>
          </Grid>

          {/* Cột phải: Content Area */}
          <Grid xs={12} sm={8} md={9}>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>
              Tất cả bảng làm việc của bạn:
            </Typography>

            {/* Empty State */}
            {boards?.length === 0 && (
              <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                <SpaceDashboardIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" fontWeight={700} color="text.secondary">
                  Chưa có bảng làm việc nào!
                </Typography>
                <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                  Nhấp vào "Create a new board" ở cột bên trái để bắt đầu.
                </Typography>
              </Box>
            )}

            {/* List Boards */}
            {boards?.length > 0 && (
              // Bắt buộc sử dụng alignItems="stretch" để các Grid con kéo dãn chiều cao bằng nhau
              <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
                {boards.map((b) => {
                  const memberCount = (b.ownerIds?.length || 0) + (b.memberIds?.length || 0)
                  return (
                    <Grid xs={12} sm={6} md={4} key={b._id} sx={{ display: 'flex', width: '100%' }}>
                      <Card
                        sx={{
                          width: '100%',
                          height: '280px', // Cố định chiều cao card 280px
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 1,
                          boxShadow: (theme) => theme.palette.mode === 'dark'
                            ? '0 4px 20px rgba(0,0,0,0.4)'
                            : '0 4px 20px rgba(0,0,0,0.05)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            boxShadow: (theme) => theme.palette.mode === 'dark'
                              ? '0 12px 30px rgba(0,0,0,0.6)'
                              : '0 12px 30px rgba(12,102,228,0.15)',
                            '& .board-link': { color: 'primary.main' }
                          }
                        }}
                      >
                        {/* Card Cover (Gradient Background) */}
                        <Box
                          sx={{
                            height: '80px',
                            background: getGradientColor(b.title),
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-end',
                            p: 1
                          }}
                        >
                          {b.type === 'public' ? (
                            <PublicIcon sx={{ color: 'white', fontSize: 18 }} />
                          ) : (
                            <LockIcon sx={{ color: 'white', fontSize: 18 }} />
                          )}
                        </Box>

                        {/* Content */}
                        <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          {/* Box chứa text trên: dùng flexGrow: 1 để tự động chiếm hết khoảng trống */}
                          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                            {/* Tiêu đề: Đặt minHeight cố định để dù 1 hay 2 dòng vẫn bằng nhau */}
                            <Typography
                              gutterBottom
                              variant="subtitle1"
                              fontWeight={700}
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: 1.3,
                                minHeight: '38px', // Cố định chiều cao tương đương 2 dòng chữ
                                mb: 1
                              }}
                            >
                              {b.title}
                            </Typography>

                            {/* Mô tả */}
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mb: 2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: 1.5,
                                fontSize: '13px',
                                minHeight: '39px' // Cố định chiều cao tương đương 2 dòng chữ
                              }}
                            >
                              {b.description || 'Không có mô tả cho bảng làm việc này.'}
                            </Typography>
                          </Box>

                          <Box>
                            <Divider sx={{ my: 1 }} />

                            {/* Hiển thị chi tiết thông tin bổ sung cực gọn bằng 1 hàng ngang */}
                            <Stack direction="row" spacing={2} sx={{ mt: 1, mb: 1 }} alignItems="center">
                              <Tooltip title={`Thành viên: ${memberCount}`}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <GroupIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                                    {memberCount}
                                  </Typography>
                                </Box>
                              </Tooltip>

                              <Tooltip title={`Số cột: ${b.columnOrderIds?.length || 0}`}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <ViewColumnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                                    {b.columnOrderIds?.length || 0}
                                  </Typography>
                                </Box>
                              </Tooltip>

                              <Tooltip title={`Ngày tạo: ${moment(b.createdAt).format('DD/MM/YYYY')}`}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto !important' }}>
                                  <CalendarMonthIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px' }}>
                                    {moment(b.createdAt).format('DD/MM')}
                                  </Typography>
                                </Box>
                              </Tooltip>
                            </Stack>

                            <Box
                              component={Link}
                              to={`/boards/${b._id}`}
                              className="board-link"
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                color: 'text.secondary',
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: '13px',
                                transition: 'color 0.2s',
                                gap: 0.5,
                                pt: 1
                              }}
                            >
                              Tru cập bảng <ArrowRightIcon fontSize="small" />
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Pagination Area */}
      {totalBoards > 0 && (
        <Box
          sx={{
            py: 3,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            mt: 'auto'
          }}
        >
          <Pagination
            size="medium"
            color="primary"
            showFirstButton
            showLastButton
            count={Math.ceil(totalBoards / DEFAULT_ITEMS_PER_PAGE)}
            page={page}
            renderItem={(item) => (
              <PaginationItem
                component={Link}
                to={`/boards${item.page === DEFAULT_PAGE ? '' : `?page=${item.page}`}`}
                {...item}
              />
            )}
          />
        </Box>
      )}
    </Container>
  )
}

export default Boards
