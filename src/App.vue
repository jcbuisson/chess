<template>
   <div class="flex items-center justify-center w-screen h-screen">

      <div class="relative">
         <div class="w-[min(100vw,100vh)]">
            <TheChessboard
               :boardConfig="boardConfig"
               @board-created="(api) => (boardAPI = api)"
               @move="onMove"
               @checkmate="handleCheckmate"
            ></TheChessboard>
         </div>

         <div class="group absolute top-0 left-0 z-10">
            <!-- collapsed: thick vertical line -->
            <div class="w-2 h-16 bg-gray-700 rounded-br group-hover:hidden"></div>
            <!-- expanded: buttons panel -->
            <div class="hidden group-hover:flex flex-col gap-2 bg-gray-800 p-2 rounded-br shadow-lg">
               <button @click="resetGame" class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 whitespace-nowrap">
                  Reset
               </button>
               <button class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 whitespace-nowrap">
                  Reverse
               </button>
            </div>
         </div>
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
   if (!isWhite.value) return; // ignore black move events

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
   isWhite.value = false

   const score = alphabeta(chess, 2, isWhite.value)
   console.log(`best computer score ${score}`)
   const bestComputerMove = chessBestMove(chess)
   // const bestComputerMove = await computerMove(chess, 2)

   // play move on model
   chess = moveResultingChess(bestComputerMove)
   // play move on boardAPI
   const legal = boardAPI.move(moveToString(bestComputerMove).substring(2))
   if (!legal) {
      console.log("ILLEGAL MOVE - SHOULD NOT HAPPEN", moveToString(bestComputerMove).substring(2))
   }
   console.log(chessToAscii(chess))

   // now it is human's turn again
   isWhite.value = true
}

// function computerMove(chess, depth) {
//    return new Promise((resolve, reject) => {
//       const score = alphabeta(chess, depth, false)
//       console.log(`best computer score ${score}`)
//       const bestComputerMove = chessBestMove(chess)
//       resolve(bestComputerMove)
//    })
// }

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
