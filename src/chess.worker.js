import { createInitialBoard, chessPossibleMoves, moveToString, moveResultingChess, alphabeta, chessBestMove, chessToAscii,
   chessPrint, chessParse, chessIsWhiteToPlay } from '/asscript/build/release.js'

self.onmessage = ({ data: { fen, depth } }) => {
   const chess = chessParse(fen)
   alphabeta(chess, depth)
   const bestMove = chessBestMove(chess)
   self.postMessage({ bestMoveStr: moveToString(bestMove) })
}
