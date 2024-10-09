// import assert from "assert"
import { createInitialBoard, chessToAscii, chessPossibleMoves, moveToString } from "../build/debug.js"

// assert.strictEqual(add(1, 2), 3)
// console.log("ok")

const c = createInitialBoard()
const ascii = chessToAscii(c)
console.log(ascii)
const moves = chessPossibleMoves(c)
for (const move of moves) {
   console.log('move', moveToString(move))
}
