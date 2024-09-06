// import assert from "assert"
import { testChessToAscii, testLocatedPieces, testMoves } from "../build/debug.js"

// assert.strictEqual(add(1, 2), 3)
// console.log("ok")


console.log('testChessToAscii')
console.log(testChessToAscii())

console.log('testLocatedPieces', testLocatedPieces())

console.log('testMoves', testMoves())
