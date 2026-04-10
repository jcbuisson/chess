// import assert from "assert"
import { createInitialBoard, chessToAscii, chessPossibleMoves_, moveToString, moveResultingChess } from "../build/debug.js"


const c0 = createInitialBoard()

// WHITE TO MOVE
let isWhite = true
console.log(chessToAscii(c0))
const moves0 = chessPossibleMoves_(c0, isWhite)
for (let i = 0; i < moves0.length; i++) {
   console.log(i, moveToString(moves0[i]))
}
const M0 = moves0[9]
console.log('playing m0', moveToString(M0))
const c1 = moveResultingChess(M0) // each move contains the resultingChess (good for speed, bad for memory)
console.log(chessToAscii(c1))

// BLACK TO MOVE
isWhite = false
const moves1 = chessPossibleMoves_(c1, isWhite)
for (let i = 0; i < moves1.length; i++) {
   console.log(i, moveToString(moves1[i]))
}
const m1 = moves1[11]
console.log('playing m1', moveToString(m1))
const c2 = moveResultingChess(m1)
console.log(chessToAscii(c2))

// WHITE TO MOVE
isWhite = true
const moves2 = chessPossibleMoves_(c2, isWhite)
for (let i = 0; i < moves2.length; i++) {
   console.log(i, moveToString(moves2[i]))
}
const M2 = moves2[24]
console.log('playing m2', moveToString(M2))
const c3 = moveResultingChess(M2)
console.log(chessToAscii(c3))

// BLACK TO MOVE
isWhite = false
const moves3 = chessPossibleMoves_(c3, isWhite)
for (let i = 0; i < moves3.length; i++) {
   console.log(i, moveToString(moves3[i]))
}
const m3 = moves3[0]
console.log('playing m3', moveToString(m3))
const c4 = moveResultingChess(m3)
console.log(chessToAscii(c4))

// WHITE TO MOVE
isWhite = true
const moves4 = chessPossibleMoves_(c4, isWhite)
for (let i = 0; i < moves4.length; i++) {
   console.log(i, moveToString(moves4[i]))
}
const M4 = moves4[18]
console.log('playing m4', moveToString(M4))
const c5 = moveResultingChess(M4)
console.log(chessToAscii(c5))

// BLACK TO MOVE
isWhite = false
const moves5 = chessPossibleMoves_(c5, isWhite)
for (let i = 0; i < moves5.length; i++) {
   console.log(i, moveToString(moves5[i]))
}
const m5 = moves5[4]
console.log('playing m5', moveToString(m5))
const c6 = moveResultingChess(m5)
console.log(chessToAscii(c6))

// WHITE TO MOVE
isWhite = true
const moves6 = chessPossibleMoves_(c6, isWhite)
for (let i = 0; i < moves6.length; i++) {
   console.log(i, moveToString(moves6[i]))
}
const m6 = moves6[17]
console.log('playing m6', moveToString(m6))
const c7 = moveResultingChess(m6)
console.log(chessToAscii(c7))

// BLACK TO MOVE
isWhite = false
const moves7 = chessPossibleMoves_(c7, isWhite)
for (let i = 0; i < moves7.length; i++) {
   console.log(i, moveToString(moves7[i]))
}
const m7 = moves7[5]
console.log('playing m7', moveToString(m7))
const c8 = moveResultingChess(m7)
console.log(chessToAscii(c8))

// WHITE TO MOVE
isWhite = true
const moves8 = chessPossibleMoves_(c8, isWhite)
for (let i = 0; i < moves8.length; i++) {
   console.log(i, moveToString(moves8[i]))
}
const M8 = moves8[33]
console.log('playing M8', moveToString(M8))
const c9 = moveResultingChess(M8)
console.log(chessToAscii(c9))

// BLACK TO MOVE
isWhite = false
const moves9 = chessPossibleMoves_(c9, isWhite)
for (let i = 0; i < moves9.length; i++) {
   console.log(i, moveToString(moves9[i]))
}
const m9 = moves9[43]
console.log('playing m9', moveToString(m9))
const c10 = moveResultingChess(m9)
console.log(chessToAscii(c10))
