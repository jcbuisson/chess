// import assert from "assert"
import { createInitialBoard, chessToAscii, chessPossibleMoves, chessPossibleMoves_, moveToString, moveResultingChess, chessTogglePlayer } from "../build/debug.js"


const c0 = createInitialBoard()

// WHITE TO MOVE
let isWhite = true
console.log(chessToAscii(c0))
const moves0 = chessPossibleMoves_(c0, isWhite)
for (let i = 0; i < moves0.length; i++) {
   console.log(i, moveToString(moves0[i]))
}
const m0 = moves0[9]
console.log('playing m0', moveToString(m0))
const c1 = moveResultingChess(m0) // each move contains the resultingChess (good for speed, bad for memory)
console.log(chessToAscii(c1))

// BLACK TO MOVE
isWhite = false
const moves1 = chessPossibleMoves_(c1, isWhite)
for (let i = 0; i < moves1.length; i++) {
   console.log(i, moveToString(moves1[i]))
}
const m1 = moves1[13]
console.log('playing m1', moveToString(m1))
const c2 = moveResultingChess(m1)
console.log(chessToAscii(c2))

// WHITE TO MOVE
isWhite = true
const moves2 = chessPossibleMoves_(c2, isWhite)
for (let i = 0; i < moves2.length; i++) {
   console.log(i, moveToString(moves2[i]))
}
