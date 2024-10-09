// import assert from "assert"
// import { testChessToAscii, testLocatedPieces, testMoves } from "../build/debug.js"
import { createInitialBoard, chessToAscii, chessPossibleMoves } from "../build/debug.js"

// assert.strictEqual(add(1, 2), 3)
// console.log("ok")

const c = createInitialBoard()
const ascii = chessToAscii(c)
console.log(ascii)
const moves = chessPossibleMoves(c)
console.log('moves', moves)

// console.log('testLocatedPieces', testLocatedPieces())

// console.log('testMoves', testMoves())
