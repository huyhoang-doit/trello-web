import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'


function BoardContent({ board }) {

  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    const orderedColumns = mapOrder(board.columns, board.columnOrderIds, '_id')
    setOrderedColumns(orderedColumns)
  }, [board])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      // Get old position
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // Get new position
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)

      // Dùng arrayMove của dnd-kit để sắp xếp lại Column ban đầu
      // Code của arrayMove ở đây: dnd-kit/packages/sortable/utilities/arrayMove.ts

      const dndOderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)

      // 2 console.log dữ liệu này dùng để xử lý gọi API
      // const dndOderedColumnsIds = dndOderedColumns.map(c => c._id)

      // console.log('dndOderedColumnsIds', dndOderedColumns)
      // console.log('dndOderedColumnsIds', dndOderedColumnsIds)

      setOrderedColumns(dndOderedColumns)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} >
      <Box sx={{
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>

  )
}

export default BoardContent
