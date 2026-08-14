/**
 * BoardCommentSection
 * Khu vực chat/comment theo thời gian thực trong board sidebar
 *
 * Features:
 * - Fetch comments khi mở
 * - Real-time: lắng nghe FE_RECEIVE_BOARD_COMMENT qua socket
 * - Auto-scroll xuống khi có comment mới
 * - Gửi comment bằng Enter hoặc nút Send
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import SendIcon from '@mui/icons-material/Send'
import ForumIcon from '@mui/icons-material/Forum'
import CommentItem from './CommentItem'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { getSocket } from '~/utils/socket'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'

function BoardCommentSection({ boardId }) {
  const currentUser = useSelector(selectCurrentUser)
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll xuống cuối danh sách comments
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto'
    })
  }, [])

  // Fetch comments ban đầu
  useEffect(() => {
    if (!boardId) return
    setIsLoading(true)
    authorizedAxiosInstance
      .get(`${API_ROOT}/v1/boards/${boardId}/comments`)
      .then((res) => {
        setComments(res.data || [])
        // Scroll về cuối ngay (không smooth) khi load lần đầu
        setTimeout(() => scrollToBottom(false), 50)
      })
      .catch(() => { })
      .finally(() => setIsLoading(false))
  }, [boardId, scrollToBottom])

  // Lắng nghe comment mới qua socket
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleNewComment = (newComment) => {
      setComments((prev) => [...prev, newComment])
      // Auto-scroll khi nhận được comment mới
      setTimeout(() => scrollToBottom(true), 50)
    }

    socket.on('FE_RECEIVE_BOARD_COMMENT', handleNewComment)

    return () => {
      socket.off('FE_RECEIVE_BOARD_COMMENT', handleNewComment)
    }
  }, [scrollToBottom])

  // Gửi comment
  const handleSend = async () => {
    const trimmed = inputValue.trim()
    if (!trimmed || isSending) return

    setIsSending(true)
    setInputValue('')
    try {
      await authorizedAxiosInstance.post(
        `${API_ROOT}/v1/boards/${boardId}/comments`,
        { content: trimmed }
      )
      // Comment sẽ được thêm vào qua socket event, không cần thêm thủ công
    } catch {
      // Khôi phục nếu gửi thất bại
      setInputValue(trimmed)
      toast.error('Gửi comment thất bại, thử lại!')
    } finally {
      setIsSending(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0
        }}
      >
        <ForumIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography variant="caption" fontWeight={700} color="text.secondary">
          BOARD CHAT
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ ml: 'auto' }}>
          {comments.length} tin nhắn
        </Typography>
      </Box>

      {/* Comment List */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 1.5,
          py: 1,
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '10px',
            bgcolor: 'rgba(0,0,0,0.15)'
          }
        }}
      >
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {!isLoading && comments.length === 0 && (
          <Box sx={{ textAlign: 'center', pt: 4, px: 2 }}>
            <ForumIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
            <Typography variant="caption" color="text.disabled" display="block">
              Chưa có tin nhắn nào.
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Hãy bắt đầu cuộc trò chuyện!
            </Typography>
          </Box>
        )}

        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            isSelf={comment.userId === currentUser?._id}
          />
        ))}

        {/* Anchor to scroll to */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input area */}
      <Box
        sx={{
          px: 1.5,
          pb: 1.5,
          pt: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
          flexShrink: 0
        }}
      >
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end' }}>
          <TextField
            inputRef={inputRef}
            fullWidth
            multiline
            maxRows={3}
            size="small"
            placeholder="Nhắn tin..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                fontSize: '13px'
              }
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending}
            size="small"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: '10px',
              width: 36,
              height: 36,
              flexShrink: 0,
              '&:hover': { bgcolor: 'primary.dark' },
              '&.Mui-disabled': { bgcolor: 'action.disabledBackground' }
            }}
          >
            {isSending
              ? <CircularProgress size={16} color="inherit" />
              : <SendIcon sx={{ fontSize: 18 }} />
            }
          </IconButton>
        </Box>
        <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block', textAlign: 'right' }}>
          Enter để gửi
        </Typography>
      </Box>
    </Box>
  )
}

export default BoardCommentSection
