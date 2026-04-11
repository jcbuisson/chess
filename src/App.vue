<template>
   <div class="flex flex-row h-screen items-center">

      <div class="flex flex-col items-center gap-4">
         <TheChessboard
            :boardConfig="boardConfig"
            @board-created="(api) => (boardAPI = api)"
            @move="onMove"
            @checkmate="handleCheckmate"
         ></TheChessboard>

         <button @click="resetGame" class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
            Reset
         </button>
      </div>

   </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { TheChessboard } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'

import { createInitialBoard, chessToAscii, chessPossibleMoves, moveToString, moveResultingChess, chessEvaluate } from "/asscript/build/release.js"

let chess
let boardAPI
const boardConfig = {
   coordinates: true,
}

const isWhite = ref(true)

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
   if (!isWhite.value) return; // ignore black move events

   const moveNotation = moveEventToString(moveEvent)
   console.log('moveEvent', moveNotation, moveEvent, isWhite.value)
   const myMoves = chessPossibleMoves(chess, isWhite.value)
   for (const move of myMoves) {
      console.log(moveToString(move))
   }
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
   isWhite.value = false

   // const score = minimax(chess, 2, true)
   // console.log(`score ${score}`)
   // const bestComputerMove = chessBestMove(chess)

   // look for computer moves
   const computerMoves = chessPossibleMoves(chess, isWhite.value)
   let bestComputerMove;
   let bestScore = Infinity
   for (let i = 0; i < computerMoves.length; i++) {
      // console.log(i, moveToString(computerMoves[i]))
      const move = computerMoves[i]
      const moveScore = chessEvaluate(moveResultingChess(move))
      if (moveScore < bestScore) {
         bestComputerMove = move
         bestScore = moveScore
      }
   }
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
   isWhite.value = true
}

function resetGame() {
   chess = createInitialBoard()
   isWhite.value = true
   boardAPI.resetBoard()
   console.log(chessToAscii(chess))
}

function handleCheckmate(isMated) {
   if (isMated === 'w') {
      alert('Black wins!');
   } else {
      alert('White wins!');
   }
}
</script>
