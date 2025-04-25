import { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import {
  SortableContext,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { createNewColumnAPI } from '~/apis'
import {
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { generatedPlaceholderCard } from '~/utils/formatter'
import { cloneDeep } from 'lodash'

const ListColumns = ({ columns }) => {
  /**
   * SortableContext yêu cầu items là một mảng chứa các kiểu dữ liệu nguyên thủy, chứ không phải object
   * Nếu không đúng thì vẫn kéo thả được nhưng không có animation
   * vì vậy phải map qua column để lấy ra mảng các id
   * https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
   */
  const board = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Please enter a new column title')
      return
    }
    // Call API
    const newColumnData = {
      title: newColumnTitle
    }

    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // Fake empty card for FE
    createdColumn.cards = [generatedPlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatedPlaceholderCard(createdColumn)._id]

    // Update board
    // Đoạn này lỗi object is not extensible bởi đã copy/clone ra giá trị newBoard nhưng bản chất của spread operator là shallow copy
    // shallow cope conflig với rule của redux toolkit ,không dùng được hàm push (vì hàm này dùng để sửa giá trị trực tiếp)
    // Có thể sử dụng hàm concat của array để thêm giá trị mới vào mảng, vì concat tạo ra mảng mới, không làm thay đổi giá trị của mảng ban đầu
    // const newBoard = { ...board }
    // Sử dụng cloneDeep để clone ra một object mới, không bị ảnh hưởng đến object ban đầu
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    dispatch(updateCurrentActiveBoard(newBoard))

    // Đóng trạng thái
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }

  return (
    <>
      <SortableContext
        items={columns?.map((c) => c._id)}
        strategy={horizontalListSortingStrategy}
      >
        <Box
          sx={{
            bgcolor: 'inherit',
            width: '100%',
            height: '100%',
            display: 'flex',
            overflowX: 'auto',
            overflowY: 'hidden',
            '&::-webkit-scrollbar-track': { m: 2 }
          }}
        >
          {columns?.map((column) => (
            <Column key={column._id} column={column} />
          ))}

          {!openNewColumnForm ? (
            <Box
              onClick={toggleOpenNewColumnForm}
              sx={{
                minWidth: '250px',
                maxWidth: '250px',
                mx: 2,
                borderRadius: '6px',
                height: 'fit-content',
                bgcolor: '#ffffff3d'
              }}
            >
              <Button
                startIcon={<NoteAddIcon />}
                sx={{
                  color: 'white',
                  width: '100%',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  pl: 2.5,
                  py: 1,
                  lineHeight: 'unset'
                }}
              >
                Add new column
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                minWidth: '250px',
                maxWidth: '250px',
                mx: 2,
                p: 1,
                borderRadius: '6px',
                height: 'fit-content',
                bgcolor: '#ffffff3d',
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <TextField
                label="Enter column title"
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                sx={{
                  '& label': { color: 'white' },
                  '& input': { color: 'white' },
                  '& label.Mui-focused': { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'white' },
                    '&:hover fieldset': { borderColor: 'white' },
                    '&.Mui-focused fieldset': { borderColor: 'white' }
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  onClick={addNewColumn}
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.success.main
                    }
                  }}
                >
                  Add Column
                </Button>
                <CloseIcon
                  fontSize="small"
                  sx={{
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { color: (theme) => theme.palette.warning.light }
                  }}
                  onClick={toggleOpenNewColumnForm}
                />
              </Box>
            </Box>
          )}
        </Box>
      </SortableContext>
    </>
  )
}

export default ListColumns
