// The entry file of your WebAssembly module.

import { Move } from './classes/Move'
import { Piece } from './classes/Piece'
import { Square } from './classes/Square'
import { Chess } from './classes/Chess'


type int = i32 // or i64

type Nullable<T> = T | null


// Compute the best score for position `chess`, and put the associated move in `chess.bestMove`
// alpha tracks the best score the maximizer is guaranteed, beta tracks the best score the minimizer is guaranteed.
// When alpha >= beta, the branch is pruned
export function alphabeta(chess: Chess, depth: int, isWhite: bool, alpha: number = -Infinity, beta: number = Infinity): number {
   if (chess.isCheckmate(isWhite)) {
      return isWhite ? Infinity : -Infinity
   }
   if (depth === 0) {
      return chess.evaluate()
   }

   if (isWhite) {
      let maxEval: number = -Infinity
      const moves = chess.possibleMoves(isWhite)
      for (let i = 0; i < moves.length; i++) {
         const move = moves[i]
         const childEval = alphabeta(move.resultingChess, depth - 1, !isWhite, alpha, beta)
         if (childEval > maxEval) {
            maxEval = childEval
            chess.bestMove = move
         }
         if (maxEval > alpha) alpha = maxEval
         if (alpha >= beta) break
      }
      return maxEval
   } else {
      let minEval: number = Infinity
      const moves = chess.possibleMoves(isWhite)
      for (let i = 0; i < moves.length; i++) {
         const move = moves[i]
         const childEval = alphabeta(move.resultingChess, depth - 1, !isWhite, alpha, beta)
         if (childEval < minEval) {
            minEval = childEval
            chess.bestMove = move
         }
         if (minEval < beta) beta = minEval
         if (alpha >= beta) break
      }
      return minEval
   }
}

// // Compute the best score for position `chess`, and put the associated move in `chess.bestMove`
// export function minimax(chess: Chess, depth: int, isWhite: bool): number {
//    if (chess.isCheckmate(isWhite)) {
//       return isWhite ? Infinity : -Infinity
//    }
//    if (depth === 0) {
//       return chess.evaluate()
//    }

//    if (isWhite) {
//       let maxEval: number = -Infinity
//       const moves = chess.possibleMoves(isWhite)
//       for (let i = 0; i < moves.length; i++) {
//          const move = moves[i]
//          const childEval = minimax(move.resultingChess, depth - 1, !isWhite)
//          if (childEval > maxEval) {
//             maxEval = childEval
//             chess.bestMove = move
//          }
//       }
//       return maxEval
//    } else {
//       let minEval: number = Infinity
//       const moves = chess.possibleMoves(isWhite)
//       for (let i = 0; i < moves.length; i++) {
//          const move = moves[i]
//          const childEval = minimax(move.resultingChess, depth - 1, !isWhite)
//          if (childEval < minEval) {
//             minEval = childEval
//             chess.bestMove = move
//          }
//       }
//       return minEval
//    }
// }

export function createInitialBoard(): Chess {
   return Chess.createInitialBoard()
}

export function chessToAscii(chess: Chess): string {
   return chess.toAscii()
}

export function chessInCheck(chess: Chess, isWhite: bool): bool {
   return chess.inCheck(isWhite)
}

export function chessBestMove(chess: Chess): Nullable<Move> {
   return chess.bestMove
}

export function squareToString(square: Square): string {
   return square.toString()
}

export function moveToString(move: Move): string {
   return move.toString()
}

export function pieceToString(piece: Piece): string {
   return piece.toString()
}

export function moveResultingChess(move: Move): Chess {
   return move.resultingChess
}

export function chessPossibleMoves(chess: Chess, isWhite: bool): Move[] {
   return chess.possibleMoves(isWhite)
}

export function chessEvaluate(chess: Chess): number {
   return chess.evaluate()
}
