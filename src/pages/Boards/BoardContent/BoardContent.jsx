import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {

  // https://docs.dndkit.com/api-documentation/sensors
  // Nếu sử dụng PointerSensor mặc định thì phải kết hợp thuộc tính CSS touch-action: none ở những phần tử kéo thả - nhưng còn bug :))
  // const pointerSensor = useSensor(PointerSensor, { activationConstraints: { distance: 10 } })

  // Yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp click bị gọi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraints: { distance: 10 } })

  // Yêu cầu nhấn giữ 250ms, dung sai cảm ứng 500px thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraints: { delay: 250, tolerance: 500 } })

  // Ưu tiên sử dụng kết hợp 2 loại sensors là mouse và touch để có trải nghiệm mobile tốt nhất, không bị bug
  // const mySensors = useSensors(pointerSensor)
  const mySensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // Cùng một thời điểm chỉ có một phần tử đang được kéo (card hoặc column)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() => {
    const orderedColumns = mapOrder(board.columns, board.columnOrderIds, '_id')
    setOrderedColumns(orderedColumns)
  }, [board])

  // Trigger khi bắt đầu kéo một phần tử - Drag
  const handleDragStart = (event) => {
    // console.log('HandleDragStart:', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }


  // Trigger khi kết thúc kéo một phần tử - Drop
  const handleDragEnd = (event) => {

    const { active, over } = event
    // over not exist => return (khong thuc hien keo tha trong tinh huong nay)
    if (!over) return

    // over exist => array remove and setOrderedColumns
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

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }
  return (
    <DndContext
      sensors={mySensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd} >
      <Box sx={{
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>

  )
}

export default BoardContent
