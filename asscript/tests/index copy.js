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

const m2 = moves2[24]
console.log('playing m2', moveToString(m2))
const c3 = moveResultingChess(m2)
console.log(chessToAscii(c3))
chessTogglePlayer(c3)
const moves3 = chessPossibleMoves(c3)
for (let i = 0; i < moves3.length; i++) {
   console.log(i, moveToString(moves3[i]))
}

const m3 = moves3[20]
console.log('playing m3', moveToString(m3))
const c4 = moveResultingChess(m3)
console.log(chessToAscii(c4))
chessTogglePlayer(c4)
const moves4 = chessPossibleMoves(c4)
for (let i = 0; i < moves4.length; i++) {
   console.log(i, moveToString(moves4[i]))
}

const m4 = moves4[23]
console.log('playing m4', moveToString(m4))
const c5 = moveResultingChess(m4)
console.log(chessToAscii(c5))
chessTogglePlayer(c5)
const moves5 = chessPossibleMoves(c5)
for (let i = 0; i < moves5.length; i++) {
   console.log(i, moveToString(moves5[i]))
}

const m5 = moves5[10]
console.log('playing m5', moveToString(m5))
const c6 = moveResultingChess(m5)
console.log(chessToAscii(c6))
chessTogglePlayer(c6)
const moves6 = chessPossibleMoves(c6)
for (let i = 0; i < moves6.length; i++) {
   console.log(i, moveToString(moves6[i]))
}

const m6 = moves6[33]
console.log('playing m6', moveToString(m6))
const c7 = moveResultingChess(m6)
console.log(chessToAscii(c7))
chessTogglePlayer(c7)
const moves7 = chessPossibleMoves(c7)
for (let i = 0; i < moves7.length; i++) {
   console.log(i, moveToString(moves7[i]))
}
