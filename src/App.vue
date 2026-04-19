<template>
   <div class="flex items-center justify-center w-screen h-screen">

      <div class="flex flex-col w-[min(100vw,100vh)]">
         <div class="flex gap-2 px-2 py-1 bg-gray-800 items-center">
            <button @click="resetGame" class="px-4 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">
               Reset
            </button>
            <button @click="revertGame" class="px-4 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">
               Revert
            </button>
            <div class="ml-auto flex items-center gap-3">
            <svg v-if="isComputing" class="animate-spin h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
               <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <div class="flex items-center gap-1">
               <span class="text-gray-400 text-sm">Depth</span>
               <button v-for="d in [2, 3, 4]" :key="d" @click="depth = d"
                  :class="['px-2 py-1 text-sm rounded', depth === d ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600']">
                  {{ d }}
               </button>
            </div>
            </div>
         </div>
         <TheChessboard
            :boardConfig="boardConfig"
            @board-created="(api) => (boardAPI = api)"
            @move="onMove"
            @checkmate="handleCheckmate"
            @stalemate="handleStalemate"
         ></TheChessboard>
      </div>

   </div>
   
   <VersionUpdater></VersionUpdater>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { TheChessboard } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'

import { createInitialBoard, chessToAscii, chessPossibleMoves, moveToString, moveResultingChess } from "/asscript/build/release.js"

import VersionUpdater from "/src/components/VersionUpdater.vue";

let chess
let boardAPI

const boardConfig = {
   fen: '4k3/8/8/8/8/8/PPPPPPPP/4K3 w KQkq - 0 1',
   coordinates: true,
}

let moveHistory = []
const isWhite = ref(true)
const isHumanWhite = ref(true)
const depth = ref(2)
const isComputing = ref(false)

const worker = new Worker(new URL('./chess.worker.js', import.meta.url), { type: 'module' })

function runAlphabeta(history) {
   return new Promise(resolve => {
      worker.onmessage = ({ data }) => resolve(data.bestMoveStr)
      worker.postMessage({ moveHistory: history, depth: depth.value })
   })
}

const STORAGE_KEY = 'chess_game_state'

function saveState() {
   localStorage.setItem(STORAGE_KEY, JSON.stringify({
      moveHistory,
      isHumanWhite: isHumanWhite.value,
      depth: depth.value,
      isWhite: isWhite.value,
   }))
}

watch(depth, saveState)

onMounted(() => {
   chess = createInitialBoard()

   const saved = localStorage.getItem(STORAGE_KEY)
   if (saved) {
      try {
         const state = JSON.parse(saved)
         depth.value = state.depth ?? 2
         isHumanWhite.value = state.isHumanWhite ?? true
         isWhite.value = state.isWhite ?? true

         if (!isHumanWhite.value) boardAPI.toggleOrientation()

         let replayChess = createInitialBoard()
         let replayIsWhite = true
         for (const moveStr of (state.moveHistory ?? [])) {
            const moves = chessPossibleMoves(replayChess, replayIsWhite)
            const move = moves.find(m => moveToString(m) === moveStr)
            if (!move) throw new Error(`move not found: ${moveStr}`)
            replayChess = moveResultingChess(move)
            boardAPI.move(moveStr.substring(2))
            replayIsWhite = !replayIsWhite
         }
         chess = replayChess
         moveHistory = state.moveHistory ?? []
      } catch (e) {
         console.error('Failed to restore game state, starting fresh', e)
         localStorage.removeItem(STORAGE_KEY)
         chess = createInitialBoard()
      }
   }
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
   for (let i = 0; i < myMoves.length; i++) {
      console.log(i, moveToString(myMoves[i]))
   }
   // get my move from possible moves
   const myMove = myMoves.find(move => moveNotation === moveToString(move))
   chess = moveResultingChess(myMove)
   moveHistory.push(moveNotation)
   console.log(chessToAscii(chess))

   if (boardAPI.getIsGameOver()) return

   isWhite.value = !isWhite.value
   isComputing.value = true

   const bestMoveStr = await runAlphabeta([...moveHistory])
   isComputing.value = false

   const computerMoves = chessPossibleMoves(chess, isWhite.value)
   const bestComputerMove = computerMoves.find(m => moveToString(m) === bestMoveStr)
   chess = moveResultingChess(bestComputerMove)
   moveHistory.push(bestMoveStr)

   boardAPI.move(bestMoveStr.substring(2))
   console.log(chessToAscii(chess))

   isWhite.value = !isWhite.value
   saveState()
}

function resetGame() {
   chess = createInitialBoard()
   moveHistory = []
   isHumanWhite.value = true
   isWhite.value = true
   boardAPI.resetBoard()
   saveState()
}

async function revertGame() {
   chess = createInitialBoard()
   moveHistory = []
   boardAPI.resetBoard()
   boardAPI.toggleOrientation()

   isHumanWhite.value = false
   isWhite.value = true
   isComputing.value = true

   const bestMoveStr = await runAlphabeta([])
   isComputing.value = false

   const moves = chessPossibleMoves(chess, true)
   const bestMove = moves.find(m => moveToString(m) === bestMoveStr)
   chess = moveResultingChess(bestMove)
   moveHistory.push(bestMoveStr)
   boardAPI.move(bestMoveStr.substring(2))

   isWhite.value = false
   saveState()
}

function handleCheckmate(isMated) {
   if (isMated === 'w') {
      alert('Black wins!');
   } else {
      alert('White wins!');
   }
}

function handleStalemate() {
  alert('Stalemate');
}
</script>
