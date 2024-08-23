import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
import { generatedPlaceholderCard } from '~/utils/formatter'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'


function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // react-router-dom
    const boardId = '66c14c41622f69315ca4e6f1'
    // Call api
    fetchBoardDetailsAPI(boardId)
      .then((board) => {

        board.columns = mapOrder(board?.columns, board?.columnOrderIds, '_id')

        board.columns.forEach(column => {
          // Fake empty card cho FE
          if (isEmpty(column.cards)) {
            column.cards = [generatedPlaceholderCard(column)]
            column.cardOrderIds = [generatedPlaceholderCard(column)._id]
          } else {
            // Sắp xếp thứ tự các cards trong columns
            column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
          }
        })
        setBoard(board)
      })

  }, [])

  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({ ...newColumnData, boardId: board._id })

    // Fake empty card for FE
    createdColumn.cards = [generatedPlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatedPlaceholderCard(createdColumn)._id]

    // Update board
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }


  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({ ...newCardData, boardId: board._id })

    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  }

  // Call API xử lý khi kéo thả Column, cập nhật lại columnOrderIds của Board đó
  const moveColumns = (dndOrderedColumns) => {
    const dndOderedColumnsIds = dndOrderedColumns.map(c => c._id)

    // Update board
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOderedColumnsIds
    setBoard(newBoard)

    // Call API update board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }

  // Call API xử lý khi kéo thả Card
  // Khi di chuyển trong 1 column thì gọi API cập nhật lại cardOrderIds của Column đó
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {

    // Update board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

    // Call API update board
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  /**
   * Khi di chuyển card sang column khác:
   * B1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó
   * B2: Cập nhật mảng cardOrderIds của Column tiếp theo
   * B3: Cập nhật lại columnId của Card đã kéo
   */
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    const dndOderedColumnsIds = dndOrderedColumns.map(c => c._id)

    // Update board
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOderedColumnsIds
    setBoard(newBoard)

    // Call API
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds: dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vh',
        height: '100vh'
      }}>
        <CircularProgress />
      </Box>
    )
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
