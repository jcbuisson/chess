import { createInitialBoard, chessPossibleMoves, moveToString, moveResultingChess, alphabeta, chessBestMove, chessToAscii, chessPrint, chessParse } from '/asscript/build/release.js'

self.onmessage = ({ data: { fen, moveHistory, depth } }) => {
   // let chess = createInitialBoard()
   // let isWhite = true

   // for (const moveStr of moveHistory) {
   //    const moves = chessPossibleMoves(chess, isWhite)
   //    const move = moves.find(m => moveToString(m) === moveStr)
   //    chess = moveResultingChess(move)
   //    isWhite = !isWhite
   // }

   const chess = chessParse(fen)
   const isWhite = false

   // isWhite is now the computer's color
   alphabeta(chess, depth, isWhite)
   const bestMove = chessBestMove(chess)
   self.postMessage({ bestMoveStr: moveToString(bestMove) })
}
