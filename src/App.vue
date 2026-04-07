<template>
   <div class="flex flex-row h-screen items-center">

      <TheChessboard
         :boardConfig="boardConfig"
         @board-created="(api) => (boardAPI = api)"
         @move="onMove"
         @checkmate="handleCheckmate"
      ></TheChessboard>

   </div>

</template>

<script setup>
import { onMounted } from 'vue'
import { TheChessboard } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'

import { createInitialBoard, chessToAscii, chessPossibleMoves, moveToString, pieceToString, squareToString, moveResultingChess, chessTogglePlayer,
   minimax, chessBestMove,
} from "/asscript/build/release.js"

let chess
let boardAPI
let myColor = 'w'
const boardConfig = {
   coordinates: true,
}

onMounted(() => {
   chess = createInitialBoard()
   console.log(chessToAscii(chess))
})

function moveEventToString(moveEvent) {
   const piece = moveEvent.color === 'w' ? moveEvent.piece.toUpperCase() : moveEvent.piece
   if (moveEvent.san === 'O-O') {
      return `${piece} O-O`
   }
   if (moveEvent.san === 'O-O-O') {
      return `${piece} O-O-O`
   }
   if (moveEvent.captured) {
      return `${piece} ${moveEvent.from}x${moveEvent.to}`
   }
   return `${piece} ${moveEvent.from}-${moveEvent.to}`
}

const onMove = (moveEvent) => {
   if (moveEvent.color !== myColor) return

   const moveNotation = moveEventToString(moveEvent)
   console.log('moveEvent', moveNotation, moveEvent)
   const myMoves = chessPossibleMoves(chess)
   // get my move from possible moves
   const myMove = myMoves.find(move => moveNotation === moveToString(move))
   console.log('myMove', moveToString(myMove))
   // execute myMove on `chess`
   chess = moveResultingChess(myMove)
   console.log(chessToAscii(chess))

   if (boardAPI.getIsGameOver()) {
      console.log("Game Over!")
      return
   }

   // now it is computer's turn
   chessTogglePlayer(chess)

   // const score = minimax(chess, 2, true)
   // console.log(`score ${score}`)
   // const bestComputerMove = chessBestMove(chess)

   // look for move to make for computer
   const computerMoves = chessPossibleMoves(chess)
   for (let i = 0; i < computerMoves.length; i++) {
      console.log(i, moveToString(computerMoves[i]))
   }
   const bestComputerMove = computerMoves[0]
   console.log('bestComputerMove', moveToString(bestComputerMove), moveToString(bestComputerMove).substring(2))

   // play move on model
   chess = moveResultingChess(bestComputerMove)
   // play move on boardAPI
   const legal = boardAPI.move(moveToString(bestComputerMove).substring(2))
   if (!legal) {
      console.log("ILLEGAL MOVE - SHOULD NOT HAPPEN", moveToString(bestComputerMove).substring(2))
   }
   // display resulting board
   console.log(chessToAscii(chess))

   // now it is human's turn again
   chessTogglePlayer(chess)
}

function handleCheckmate(isMated) {
   if (isMated === 'w') {
      alert('Black wins!');
   } else {
      alert('White wins!');
   }
}
</script>
