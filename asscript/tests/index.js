// import assert from "assert"
import { Chess } from "chess.js"
import { chessToAscii, chessInCheck, chessPossibleMoves, moveToString, moveResultingChess, chessEvaluate,
   chessPrint, chessParse } from "../build/debug.js"

// let chess = chessParse('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNRYYYY w KQkq - 0 1')

// let isWhite = true
// let count = 0
// while (true) {
//    console.log(chessToAscii(chess))
//    if (chessInCheck(chess, isWhite)) break;
//    const moves = chessPossibleMoves(chess, isWhite)
//    let bestMove
//    let bestScore = isWhite ? -Infinity : Infinity
//    for (let i = 0; i < moves.length; i++) {
//       const move = moves[i]
//       const moveChess = moveResultingChess(move)
//       const moveScore = chessEvaluate(moveChess)
//       if (isWhite && (moveScore > bestScore) || !isWhite && (moveScore < bestScore)) {
//          bestScore = eval
//          bestMove = move
//       }
//    }
//    console.log(`${isWhite ? 'white' : 'black'} play ${moveToString(bestMove)}`)
//    chess = moveResultingChess(bestMove)
//    isWhite = !isWhite
//    count += 1
//    if (count > 40) break
// }

const c0 = chessParse('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNRYYYY w KQkq - 0 1')

// WHITE TO MOVE
let isWhite = true
console.log(chessToAscii(c0))
const moves0 = chessPossibleMoves(c0, isWhite)
for (let i = 0; i < moves0.length; i++) {
   console.log(i, moveToString(moves0[i]))
}
const M0 = moves0[9]
console.log('playing m0', moveToString(M0))
const c1 = moveResultingChess(M0) // each move contains the resultingChess (good for speed, bad for memory)
if (chessInCheck(c1, !isWhite)) console.log("Check!")
console.log('score', chessEvaluate(c1))
console.log(chessToAscii(c1))

// BLACK TO MOVE
isWhite = false
const moves1 = chessPossibleMoves(c1, isWhite)
for (let i = 0; i < moves1.length; i++) {
   console.log(i, moveToString(moves1[i]))
}
const m1 = moves1[11]
console.log('playing m1', moveToString(m1))
const c2 = moveResultingChess(m1)
if (chessInCheck(c2, !isWhite)) console.log("Check!")
console.log('score', chessEvaluate(c2))
console.log(chessToAscii(c2))

// WHITE TO MOVE
isWhite = true
const moves2 = chessPossibleMoves(c2, isWhite)
for (let i = 0; i < moves2.length; i++) {
   console.log(i, moveToString(moves2[i]))
}
const M2 = moves2[24]
console.log('playing m2', moveToString(M2))
const c3 = moveResultingChess(M2)
if (chessInCheck(c3, !isWhite)) console.log("Check!")
console.log('score', chessEvaluate(c3))
console.log(chessToAscii(c3))

// BLACK TO MOVE
isWhite = false
const moves3 = chessPossibleMoves(c3, isWhite)
for (let i = 0; i < moves3.length; i++) {
   console.log(i, moveToString(moves3[i]))
}
const m3 = moves3[0]
console.log('playing m3', moveToString(m3))
const c4 = moveResultingChess(m3)
if (chessInCheck(c4, !isWhite)) console.log("Check!")
console.log('score', chessEvaluate(c4))
console.log(chessToAscii(c4))

// WHITE TO MOVE
isWhite = true
const moves4 = chessPossibleMoves(c4, isWhite)
for (let i = 0; i < moves4.length; i++) {
   console.log(i, moveToString(moves4[i]))
}
const M4 = moves4[18]
console.log('playing m4', moveToString(M4))
const c5 = moveResultingChess(M4)
if (chessInCheck(c5, !isWhite)) console.log("Check!")
console.log('score', chessEvaluate(c5))
console.log(chessToAscii(c5))

// BLACK TO MOVE
isWhite = false
const moves5 = chessPossibleMoves(c5, isWhite)
for (let i = 0; i < moves5.length; i++) {
   console.log(i, moveToString(moves5[i]))
}
const m5 = moves5[4]
console.log('playing m5', moveToString(m5))
const c6 = moveResultingChess(m5)
if (chessInCheck(c6, !isWhite)) console.log("Check!")
console.log('score', chessEvaluate(c6))
console.log(chessToAscii(c6))

// WHITE TO MOVE
isWhite = true
const moves6 = chessPossibleMoves(c6, isWhite)
for (let i = 0; i < moves6.length; i++) {
   console.log(i, moveToString(moves6[i]))
}
const m6 = moves6[17]
console.log('playing m6', moveToString(m6))
const c7 = moveResultingChess(m6)
if (chessInCheck(c7, !isWhite)) console.log("Check!")
console.log('score', chessEvaluate(c7))
console.log(chessToAscii(c7))

// BLACK TO MOVE
isWhite = false
const moves7 = chessPossibleMoves(c7, isWhite)
for (let i = 0; i < moves7.length; i++) {
   console.log(i, moveToString(moves7[i]))
}
const m7 = moves7[5]
console.log('playing m7', moveToString(m7))
const c8 = moveResultingChess(m7)
if (chessInCheck(c8, !isWhite)) console.log("Check!")
console.log('score', chessEvaluate(c8))
console.log(chessToAscii(c8))
console.log(chessPrint(c8))

// WHITE TO MOVE
isWhite = true
const moves8 = chessPossibleMoves(c8, isWhite)
for (let i = 0; i < moves8.length; i++) {
   console.log(i, moveToString(moves8[i]))
}
const M8 = moves8[33]
console.log('playing M8', moveToString(M8))
const c9 = moveResultingChess(M8)
if (chessInCheck(c9, !isWhite)) console.log("Check!")
console.log('score', chessEvaluate(c9))
console.log(chessToAscii(c9))

// BLACK TO MOVE
isWhite = false
const moves9 = chessPossibleMoves(c9, isWhite)
for (let i = 0; i < moves9.length; i++) {
   console.log(i, moveToString(moves9[i]))
}
const m9 = moves9[43]
console.log('playing m9', moveToString(m9))
const c10 = moveResultingChess(m9)
if (chessInCheck(c10, !isWhite)) console.log("Check!")
console.log('score', chessEvaluate(c10))
console.log(chessToAscii(c10))
console.log(chessPrint(c10))
