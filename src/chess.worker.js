import { createInitialBoard, chessPossibleMoves, moveToString, moveResultingChess, alphabeta, chessBestMove, chessToAscii, chessPrint, chessParse } from '/asscript/build/release.js'

self.onmessage = ({ data: { fen, moveHistory, depth } }) => {
   console.log('fen', fen)
   const cfen = chessParse(fen)
   console.log('fen')
   chessPrint(cfen)

   let chess = createInitialBoard()
   let isWhite = true

   for (const moveStr of moveHistory) {
      const moves = chessPossibleMoves(chess, isWhite)
      const move = moves.find(m => moveToString(m) === moveStr)
      chess = moveResultingChess(move)
      isWhite = !isWhite
   }

   // isWhite is now the computer's color
   alphabeta(chess, depth, isWhite)
   const bestMove = chessBestMove(chess)
   self.postMessage({ bestMoveStr: moveToString(bestMove) })
}
