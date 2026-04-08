// import assert from "assert"
import { createInitialBoard, chessToAscii, chessPossibleMoves, chessPossibleMoves_, moveToString, moveResultingChess, chessTogglePlayer } from "../build/debug.js"


const c0 = createInitialBoard()

// whites to move
let isWhite = true
console.log(chessToAscii(c0))
// const moves0 = chessPossibleMoves(c0)
const moves0_ = chessPossibleMoves_(c0, isWhite)
for (let i = 0; i < moves0_.length; i++) {
   // console.log(i, moveToString(moves0[i]))
   console.log(i, moveToString(moves0_[i]))
}

// black to move
isWhite = false
const m0 = moves0_[9]
console.log('playing m0', moveToString(m0))
// const c1 = moveResultingChess(m0)
// console.log(chessToAscii(c1))
// chessTogglePlayer(c1)
// const moves1 = chessPossibleMoves(c1)
// for (let i = 0; i < moves1.length; i++) {
//    console.log(i, moveToString(moves1[i]))
// }
