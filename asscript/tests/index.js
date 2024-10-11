// import assert from "assert"
import { createInitialBoard, chessToAscii, chessPossibleMoves, moveToString, moveResultingChess, chessTogglePlayer } from "../build/debug.js"

// assert.strictEqual(add(1, 2), 3)
// console.log("ok")

const c0 = createInitialBoard()
console.log(chessToAscii(c0))
const moves0 = chessPossibleMoves(c0)
for (let i = 0; i < moves0.length; i++) {
   console.log(i, moveToString(moves0[i]))
}

const m0 = moves0[9]
console.log('playing m0', moveToString(m0))
const c1 = moveResultingChess(m0)
console.log(chessToAscii(c1))
chessTogglePlayer(c1)
const moves1 = chessPossibleMoves(c1)
for (let i = 0; i < moves1.length; i++) {
   console.log(i, moveToString(moves1[i]))
}

const m1 = moves1[13]
console.log('playing m1', moveToString(m1))
const c2 = moveResultingChess(m1)
console.log(chessToAscii(c2))
chessTogglePlayer(c2)
const moves2 = chessPossibleMoves(c2)
for (let i = 0; i < moves2.length; i++) {
   console.log(i, moveToString(moves2[i]))
}

const m2 = moves2[23]
console.log('playing m2', moveToString(m2))
const c3 = moveResultingChess(m2)
console.log(chessToAscii(c3))
chessTogglePlayer(c3)
const moves3 = chessPossibleMoves(c3)
for (let i = 0; i < moves3.length; i++) {
   console.log(i, moveToString(moves3[i]))
}
