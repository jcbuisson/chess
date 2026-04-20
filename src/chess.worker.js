import { createInitialBoard, chessPossibleMoves, moveToString, moveResultingChess, alphabeta, chessBestMove, chessToAscii,
   chessPrint, chessParse, chessIsWhiteToPlay } from '/asscript/build/release.js'

self.onmessage = ({ data: { fen, moveHistory, depth } }) => {
   const chess = chessParse(fen)
   const isWhite = !chessIsWhiteToPlay(chess)

   // isWhite is now the computer's color
   alphabeta(chess, depth, isWhite)
   const bestMove = chessBestMove(chess)
   self.postMessage({ bestMoveStr: moveToString(bestMove) })
}
