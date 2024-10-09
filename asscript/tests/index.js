// import assert from "assert"
import { createInitialBoard, chessToAscii, chessPossibleMoves, moveToString, moveResultingChess, chessTogglePlayer } from "../build/debug.js"

// assert.strictEqual(add(1, 2), 3)
// console.log("ok")

const c0 = createInitialBoard()
console.log(chessToAscii(c0))

const moves0 = chessPossibleMoves(c0)
for (const move of moves0) {
   console.log('move', moveToString(move))
}

const m0 = moves0[9]
console.log('playing m0', moveToString(m0))

const c1 = moveResultingChess(m0)
console.log(chessToAscii(c1))

chessTogglePlayer(c1)
const moves1 = chessPossibleMoves(c1)
for (const move of moves1) {
   console.log('move', moveToString(move))
}

const m1 = moves1[9]
console.log('playing m1', moveToString(m1))

const c2 = moveResultingChess(m1)
console.log(chessToAscii(c2))

chessTogglePlayer(c2)
const moves2 = chessPossibleMoves(c2)
for (const move of moves2) {
   console.log('move', moveToString(move))
}
