import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import AbcIcon from '@mui/icons-material/Abc'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import { createNewBoardAPI } from '~/apis'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

import { styled } from '@mui/material/styles'
const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
  }
}))

const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

function SidebarCreateBoardModal({ afterCreateBoard }) {
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm()
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const handleOpenModal = () => setIsOpen(true)
  const handleCloseModal = () => {
    setIsOpen(false)
    reset()
  }

  const submitCreateNewBoard = (data) => {
    const { title, description, type } = data

    toast.promise(
      createNewBoardAPI({ title, description, type }),
      {
        pending: 'Creating board...',
        success: 'Board created successfully! 🎉',
        error: 'Failed to create board. 😢'
      }
    ).then((newBoard) => {
      handleCloseModal()
      
      // Nếu có callback để refresh list (trang list board)
      if (typeof afterCreateBoard === 'function') {
        afterCreateBoard()
      }

      // Tự động chuyển hướng vào chi tiết board mới tạo để tăng trải nghiệm
      navigate(`/boards/${newBoard._id}`)
    }).catch(() => {})
  }

  return (
    <>
      <SidebarItem onClick={handleOpenModal}>
        <LibraryAddIcon fontSize="small" />
        Create a new board
      </SidebarItem>

      <Dialog
        open={isOpen}
        onClose={handleCloseModal}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            overflow: 'hidden'
          }
        }}
      >
        <form onSubmit={handleSubmit(submitCreateNewBoard)}>
          {/* Header */}
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 2.5,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0',
              color: 'white'
            }}
          >
            <LibraryAddIcon />
            <Typography variant="h6" fontWeight={700} component="span">
              Create new board
            </Typography>
          </DialogTitle>

          {/* Form Content */}
          <DialogContent sx={{ pt: '24px !important', pb: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <TextField
                  fullWidth
                  label="Title"
                  type="text"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AbcIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  {...register('title', {
                    required: FIELD_REQUIRED_MESSAGE,
                    minLength: { value: 3, message: 'Min Length is 3 characters' },
                    maxLength: { value: 50, message: 'Max Length is 50 characters' }
                  })}
                  error={!!errors['title']}
                />
                <FieldErrorAlert errors={errors} fieldName={'title'} />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label="Description"
                  type="text"
                  variant="outlined"
                  multiline
                  rows={3}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  {...register('description', {
                    required: FIELD_REQUIRED_MESSAGE,
                    minLength: { value: 3, message: 'Min Length is 3 characters' },
                    maxLength: { value: 255, message: 'Max Length is 255 characters' }
                  })}
                  error={!!errors['description']}
                />
                <FieldErrorAlert errors={errors} fieldName={'description'} />
              </Box>

              {/* Board Type Selection */}
              <Box>
                <FormLabel component="legend" sx={{ fontSize: '13px', fontWeight: 600, mb: 0.5 }}>
                  Privacy
                </FormLabel>
                <Controller
                  name="type"
                  defaultValue={BOARD_TYPES.PUBLIC}
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      row
                      onChange={(event, value) => field.onChange(value)}
                      value={field.value}
                    >
                      <FormControlLabel
                        value={BOARD_TYPES.PUBLIC}
                        control={<Radio size="small" />}
                        label="Public (Anyone can see)"
                        sx={{ '& .MuiFormControlLabel-label': { fontSize: '13px' } }}
                      />
                      <FormControlLabel
                        value={BOARD_TYPES.PRIVATE}
                        control={<Radio size="small" />}
                        label="Private (Members only)"
                        sx={{ '& .MuiFormControlLabel-label': { fontSize: '13px' } }}
                      />
                    </RadioGroup>
                  )}
                />
              </Box>
            </Box>
          </DialogContent>

          {/* Action buttons */}
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button
              onClick={handleCloseModal}
              color="inherit"
              variant="outlined"
              sx={{ borderRadius: '8px', textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: '#1565c0',
                '&:hover': { bgcolor: '#0d47a1' }
              }}
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default SidebarCreateBoardModal
