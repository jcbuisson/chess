<template>
   <div class="flex items-center justify-center w-screen h-screen">

      <div class="flex flex-col w-[min(100vw,100vh)]">
         <div class="flex gap-2 px-2 py-1 bg-gray-800">
            <button @click="resetGame" class="px-4 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">
               Reset
            </button>
            <button @click="revertGame" class="px-4 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">
               Revert
            </button>
         </div>
         <TheChessboard
            :boardConfig="boardConfig"
            @board-created="(api) => (boardAPI = api)"
            @move="onMove"
            @checkmate="handleCheckmate"
         ></TheChessboard>
      </div>

   </div>
   
   <VersionUpdater></VersionUpdater>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { TheChessboard } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'

import { createInitialBoard, chessToAscii, chessPossibleMoves, moveToString, moveResultingChess, chessEvaluate, alphabeta, chessBestMove } from "/asscript/build/release.js"
import VersionUpdater from "/src/components/VersionUpdater.vue";

let chess
let boardAPI
const boardConfig = {
   coordinates: true,
}

const isWhite = ref(true)
const isHumanWhite = ref(true)
const depth = ref(2)

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

const onMove = async (moveEvent) => {
   if (isWhite.value !== isHumanWhite.value) return; // ignore opponent move events

   const moveNotation = moveEventToString(moveEvent)
   // console.log('moveEvent', moveNotation, moveEvent, isWhite.value)
   const myMoves = chessPossibleMoves(chess, isWhite.value)
   // get my move from possible moves
   const myMove = myMoves.find(move => moveNotation === moveToString(move))
   // execute myMove on `chess`
   chess = moveResultingChess(myMove)
   console.log(chessToAscii(chess))

   if (boardAPI.getIsGameOver()) {
      console.log("Game Over!")
      return
   }

   // now it is computer's turn
   isWhite.value = !isWhite.value

   const score = alphabeta(chess, depth.value, isWhite.value)
   console.log(`best computer score ${score}`)
   const bestComputerMove = chessBestMove(chess)

   // play move on model
   chess = moveResultingChess(bestComputerMove)
   // play move on boardAPI
   const legal = boardAPI.move(moveToString(bestComputerMove).substring(2))
   if (!legal) {
      console.log("ILLEGAL MOVE - SHOULD NOT HAPPEN", moveToString(bestComputerMove).substring(2))
   }
   console.log(chessToAscii(chess))

   // now it is human's turn again
   isWhite.value = !isWhite.value
}

function resetGame() {
   chess = createInitialBoard()
   isHumanWhite.value = true
   isWhite.value = true
   boardAPI.resetBoard()
}

function revertGame() {
   chess = createInitialBoard()
   boardAPI.resetBoard()
   boardAPI.toggleOrientation()

   isHumanWhite.value = false
   isWhite.value = true
   const score = alphabeta(chess, depth.value, isWhite.value)
   console.log(`best computer score ${score}`)
   const bestComputerMove = chessBestMove(chess)

   // play move on model
   chess = moveResultingChess(bestComputerMove)
   // play move on boardAPI
   const legal = boardAPI.move(moveToString(bestComputerMove).substring(2))
   if (!legal) {
      console.log("ILLEGAL MOVE - SHOULD NOT HAPPEN", moveToString(bestComputerMove).substring(2))
   }
   console.log(chessToAscii(chess))
   // now it is human's turn
   isWhite.value = false
}

function handleCheckmate(isMated) {
   if (isMated === 'w') {
      alert('Black wins!');
   } else {
      alert('White wins!');
   }
}
</script>
