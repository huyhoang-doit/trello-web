import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI } from '~/apis'
import { generatedPlaceholderCard } from '~/utils/formatter'
import { isEmpty } from 'lodash'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // react-router-dom
    const boardId = '66c14c41622f69315ca4e6f1'
    // Call api
    fetchBoardDetailsAPI(boardId)
      .then((data) => {
        data.columns.forEach(column => {
          if (isEmpty(column.cards)) {
            column.cards = [generatedPlaceholderCard(column)]
            column.cardOrderIds = [generatedPlaceholderCard(column)._id]
          }
        })
        setBoard(data)
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
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container>
  )
}

export default Board
