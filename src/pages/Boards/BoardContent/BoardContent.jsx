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
  closestCorners,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'
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
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  useEffect(() => {
    const orderedColumns = mapOrder(board.columns, board.columnOrderIds, '_id')
    setOrderedColumns(orderedColumns)
  }, [board])

  // Tìm column theo cardId
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // 1 - Trigger khi bắt đầu kéo một phần tử - Drag
  const handleDragStart = (event) => {
    // console.log('handleDragStart:', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    if (event?.active?.data?.current?.columnId) {
      // Nếu là kéo card thì mới thực hiện set giá trị oldColumn
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // 2 - Trigger trong quá trình kéo một phần tử
  const handleDragOver = (event) => {
    // console.log('handleDragOver:', event)

    // Không làm gì thêm khi item là column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // Nếu item là card sẽ xủ lý cho item card có thể qua lại giữa các column
    const { active, over } = event

    // over exist => array remove and setOrderedColumns
    if (!active || !over) return

    // Object destructuring {}
    // activeDragingCardId là id của card đang được kéo
    const { id: activeDragingCardId, data: { current: activeDraggingCardData } } = active

    // overCardId là id card đang tương tác trên hoặc dưới so với cái card đang được kéo ở trên
    const { id: overCardId } = over

    // Tìm 2 cái column theo 2 id ở trên
    const activeColumn = findColumnByCardId(activeDragingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // Nếu không tồn tại 1 trong 2 column thì không làm gì
    if (!activeColumn || !overColumn) return

    // Xử lý logic khi kéo qua 2 column khác nhau
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns(prevColumns => {
        // Tìm vị trí của overCard trong column đích
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

        // Logic tính toán cardIndex mới (trên hoặc dưới của overCard) lấy chuẩn ra từ code thư viện dndkit
        let newCardIdex
        const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height

        const modifier = isBelowOverItem ? 1 : 0

        newCardIdex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        // Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại OrderedColumnsState mới
        const nextColumns = cloneDeep(prevColumns)

        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)


        // ** Xử lý cards bên column cũ
        if (nextActiveColumn) {
          // Xóa card ở cái column active (cũng có thể hiểu là column cũ, cái lúc mà kéo card ra khỏi nó để sang column khác)
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDragingCardId)

          // Cập nhật lại data cardOrderIds của nextActiveColumn
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }

        // ** Xử lý cards bên column mới
        if (nextOverColumn) {
          // Kiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDragingCardId)

          // Thêm cái card đang kéo vào vị trí mới bên overColumn
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIdex, 0, activeDraggingCardData)

          // Cập nhật lại data cardOrderIds của nextColumn
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }

        return nextColumns
      })
    }
  }

  // 3 - Trigger khi kết thúc kéo một phần tử - Drop
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd:', event)

    const { active, over } = event
    // over or active not exist => return (Không thực hiện kéo thả khi không có tk over)
    if (!active || !over) return

    // Xử lý kéo thả CARD
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // Object destructuring {}
      // activeDragingCardId là id của card đang được kéo
      const { id: activeDragingCardId, data: { current: activeDraggingCardData } } = active

      // overCardId là id card đang tương tác trên hoặc dưới so với cái card đang được kéo ở trên
      const { id: overCardId } = over

      // Tìm 2 cái column theo 2 id ở trên
      const activeColumn = findColumnByCardId(activeDragingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // Nếu không tồn tại 1 trong 2 column thì không làm gì
      if (!activeColumn || !overColumn) return

      // Hành động kéo thả card giữa 2 column khác nhau, phải dùng oldColumnWhenDraggingCard so sánh vì activeColumn lúc này đã setState một lần tại handleDragOver
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        console.log('Hành động kéo thả card giữa 2 column khác nhau')
      } else {
        // Get old postion
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // Get new position
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)


        // Dùng arrayMove của dnd-kit để sắp xếp lại Card ban đầu
        // Code của arrayMove ở đây: dnd-kit/packages/sortable/utilities/arrayMove.ts
        const dndOderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        // Cập nhật lại state
        setOrderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)

          targetColumn.cards = dndOderedCards
          targetColumn.cardOrderIds = dndOderedCards.map(card => card._id)

          return nextColumns
        })
      }
    }


    // Xử lý kéo thả COLUMN
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // over exist => array remove and setOrderedColumns
      if (active.id !== over.id) {
        // Get old position
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // Get new position
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

        // Dùng arrayMove của dnd-kit để sắp xếp lại Column ban đầu
        // Code của arrayMove ở đây: dnd-kit/packages/sortable/utilities/arrayMove.ts

        const dndOderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

        // 2 console.log dữ liệu này dùng để xử lý gọi API
        // const dndOderedColumnsIds = dndOderedColumns.map(c => c._id)

        // console.log('dndOderedColumnsIds', dndOderedColumns)
        // console.log('dndOderedColumnsIds', dndOderedColumnsIds)

        setOrderedColumns(dndOderedColumns)
      }
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }
  return (
    <DndContext
      // Cảm biến va chạm
      sensors={mySensors}
      // Thuật toán phát hiện va chạm
      // https://docs.dndkit.com/api-documentation/context-provider/collision-detection-algorithms
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
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
