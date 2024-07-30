import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'


const ListColumns = ({ columns }) => {
  /**
   * SortableContext yêu cầu items là một mảng chứa các kiểu dữ liệu nguyên thủy, chứ không phải object
   * Nếu không đúng thì vẫn kéo thả được nhưng không có animation
   * vì vậy phải map qua column để lấy ra mảng các id
   * https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
   */

  return (
    <>
      <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
        <Box sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': { m: 2 }
        }}>
          {columns.map((column) => (
            <Column key={column._id} column={column} />
          )
          )}
          <Box sx={{
            minWidth: '200px',
            maxWidth: '200px',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',

          }}>
            <Button startIcon={<NoteAddIcon />}
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
        </Box>
      </SortableContext>
    </>
  )
}

export default ListColumns
