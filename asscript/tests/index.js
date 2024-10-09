// import assert from "assert"
import { createInitialBoard, chessToAscii, chessPossibleMoves, moveToString, moveResultingChess } from "../build/debug.js"

// assert.strictEqual(add(1, 2), 3)
// console.log("ok")

const c0 = createInitialBoard()
console.log(chessToAscii(c0))

const moves0 = chessPossibleMoves(c0)
for (const move of moves0) {
   console.log('move', moveToString(move))
}

const m0 = moves0[10]
console.log('playing m0', moveToString(m0))

const c1 = moveResultingChess(m0)
console.log(chessToAscii(c1))
