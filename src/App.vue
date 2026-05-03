<template>
   <div class="flex items-center justify-center w-screen h-screen">

      <div class="flex flex-col w-[min(100vw,100vh)]">
         <div class="flex gap-2 px-2 py-1 bg-gray-800 items-center">
            <button @click="resetGame" class="px-4 py-1 bg-gray-800 text-gray-100 rounded hover:bg-gray-600">
               <svg viewBox="0 0 24 24" class="h-5 w-5"><path fill="currentColor" :d="mdiReload" /></svg>
            </button>
            <button @click="resetGame960" class="px-4 py-1 bg-gray-800 text-white rounded hover:bg-gray-600">
               <span class="text-gray-100 text-sm">960</span>
            </button>
            <button @click="reverseGame" class="px-4 py-1 bg-gray-800 text-gray-100 rounded hover:bg-gray-600">
               <svg viewBox="0 0 24 24" class="h-È w-6"><path fill="currentColor" :d="mdiToggleSwitch" /></svg>
            </button>
            <a href="https://github.com/jcbuisson/chess" target="_blank" rel="noopener" class="px-2 py-1 text-gray-200 hover:text-white">
               <svg viewBox="0 0 24 24" class="h-5 w-5"><path fill="currentColor" :d="mdiGithub" /></svg>
            </a>
            
            <div class="ml-auto flex items-center gap-3">
            <svg v-if="isComputing" class="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
               <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <div class="flex items-center gap-1">
               <span class="text-gray-400 text-sm">Depth</span>
               <button v-for="d in [2, 3, 4]" :key="d" @click="depth = d" :disabled="isComputing"
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
            @checkmate="onCheckmate"
            @stalemate="onStalemate"
            @draw="onDraw"
         ></TheChessboard>
      </div>

   </div>

   <Transition name="modal">
      <div v-if="modalMessage" class="fixed inset-0 flex items-center justify-center z-50">
         <div class="absolute inset-0 bg-black/60" @click="modalMessage = null"></div>
         <div class="relative bg-gray-800 text-white rounded-xl shadow-2xl px-10 py-8 flex flex-col items-center gap-5 min-w-[220px]">
            <span class="text-2xl font-semibold">{{ modalMessage }}</span>
            <button @click="modalMessage = null" class="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium">OK</button>
         </div>
      </div>
   </Transition>

   <VersionUpdater></VersionUpdater>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { mdiReload, mdiRestore, mdiToggleSwitch, mdiToggleSwitchOffOutline, mdiGithub } from '@mdi/js'
import { TheChessboard } from 'vue3-chessboard'
import 'vue3-chessboard/style.css'

import { createInitialBoard, createInitial960Board, chessToAscii, chessPrint, chessParse,
   chessPossibleMoves, moveToString, moveResultingChess } from "/asscript/build/release.js"

import VersionUpdater from "/src/components/VersionUpdater.vue";

let chess
let boardAPI

const boardConfig = {
   fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
   // fen: 'rnbq1bnr/pp3Qpp/3p4/3Bp3/4P3/8/PPPP1PPP/RNB1K1NR w KQ-- - 0 1',
   coordinates: true,
}

let moveHistory = []
const isHumanWhite = ref(true)
const depth = ref(2)
const isComputing = ref(false)
const modalMessage = ref(null)

const worker = new Worker(new URL('./chess.worker.js', import.meta.url), { type: 'module' })

function runAlphabeta(chess) {
   return new Promise(resolve => {
      worker.onmessage = ({ data }) => resolve(data.bestMoveStr)
      worker.postMessage({
         fen: chessPrint(chess),
         depth: depth.value,
      })
   })
}

const STORAGE_KEY = 'chess_game_state'

function saveState() {
   localStorage.setItem(STORAGE_KEY, JSON.stringify({
      fen: chessPrint(chess),
      moveHistory,
      isHumanWhite: isHumanWhite.value,
      depth: depth.value,
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

         // if (!isHumanWhite.value) boardAPI.toggleOrientation()
         setBoardOrientation(isHumanWhite.value)

         chess = chessParse(state.fen)
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
   // console.log('moveEvent', moveEvent)
   moveHistory.push(moveEvent.san)
   if (moveEvent.color === 'w' && !isHumanWhite.value || moveEvent.color === 'b' && isHumanWhite.value) return; // ignore opponent move events

   const moveNotation = moveEventToString(moveEvent)
   const myMoves = chessPossibleMoves(chess)
   for (let i = 0; i < myMoves.length; i++) {
      // console.log(i, moveToString(myMoves[i]))
   }
   // get my move from possible moves
   const myMove = myMoves.find(move => moveNotation === moveToString(move))
   chess = moveResultingChess(myMove)
   console.log('my move', moveNotation, 'chess', chessPrint(chess))

   if (boardAPI.getIsGameOver()) {
      console.log("GAME IS OVER")
      return
   }

   isComputing.value = true

   const bestMoveStr = await runAlphabeta(chess)
   isComputing.value = false

   const computerMoves = chessPossibleMoves(chess)
   const bestComputerMove = computerMoves.find(m => moveToString(m) === bestMoveStr)
   chess = moveResultingChess(bestComputerMove)

   boardAPI.move(bestMoveStr.substring(2))
   console.log('opponent move', bestMoveStr, 'chess', chessPrint(chess))
   console.log(chessToAscii(chess))

   saveState()
}

const isWhiteOrientation = ref(true)
function resetBoardOrientation() {
   if (!isWhiteOrientation.value) boardAPI.toggleOrientation()
   isWhiteOrientation.value = true
}
function setBoardOrientation(isWhite) {
   if (isWhite === isWhiteOrientation.value) return
   isWhiteOrientation.value = isWhite
   boardAPI.toggleOrientation()
}

function resetGame() {
   resetBoardOrientation()
   chess = createInitialBoard()
   moveHistory = []
   isHumanWhite.value = true
   boardAPI.resetBoard()
   saveState()
}

async function resetGame960() {
   resetBoardOrientation()
   chess = createInitial960Board()
   moveHistory = []
   isHumanWhite.value = true
   boardAPI.setPosition(chessPrint(chess))
   saveState()
}

async function reverseGame() {
   isHumanWhite.value = !isHumanWhite.value
   // boardAPI.toggleOrientation()
   setBoardOrientation(isHumanWhite.value)

   isComputing.value = true
   const bestMoveStr = await runAlphabeta(chess)
   isComputing.value = false

   const moves = chessPossibleMoves(chess, true)
   const bestMove = moves.find(m => moveToString(m) === bestMoveStr)
   chess = moveResultingChess(bestMove)
   boardAPI.move(bestMoveStr.substring(2))

   saveState()
}

function onCheckmate(isMated) {
   modalMessage.value = isMated === 'b' ? 'Black wins!' : 'White wins!'
}

function onStalemate() {
   modalMessage.value = 'Stalemate!'
}

function onDraw() {
   modalMessage.value = 'Draw!'
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
