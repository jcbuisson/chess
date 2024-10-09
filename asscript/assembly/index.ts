// The entry file of your WebAssembly module.

import { Move } from './classes/Move'
import { Piece } from './classes/Piece'
import { Chess } from './classes/Chess'


type int = i32 // or i64
const PositiveInfinity = i32.MAX_VALUE // or i64.MAX_VALUE
const NegativeInfinity = i32.MIN_VALUE // or i64.MIN_VALUE

type Nullable<T> = T | null



export function alphaBeta(
   depth: int,          // Current depth in game tree
   maxDepth: int,
   nodeIndex: int,      // Index of current node in scores array
   isMaximizingPlayer: bool, // True if maximizing player, False if minimizing player
   scores: StaticArray<int>, // Array of leaf node scores
   alpha: int,          // Alpha value
   beta: int            // Beta value
): int {
   if (depth === maxDepth) { // Assume maximum depth of 3
      return unchecked(scores[nodeIndex])
   }

   if (isMaximizingPlayer) {
      let maxEval: int = NegativeInfinity
      for (let i = 0; i < 2; i++) { // Assume binary tree
         const value: int = alphaBeta(depth + 1, maxDepth, nodeIndex * 2 + i, false, scores, alpha, beta);
         maxEval = max(maxEval, value)
         alpha = max(alpha, value)
         if (beta <= alpha) {
            break
         }
      }
      return maxEval
   } else {
      let minEval: int = PositiveInfinity
      for (let i = 0; i < 2; i++) {
         const value: int = alphaBeta(depth + 1, maxDepth, nodeIndex * 2 + i, true, scores, alpha, beta)
         minEval = min(minEval, value)
         beta = min(beta, value)
         if (beta <= alpha) {
            break
         }
      }
      return minEval
   }
}


// // global state
// const currentChess: Chess = Chess.createInitialBoard()

// export function testLocatedPieces(): string {
//    const lpieces: Piece[] = currentChess.piecesOf(true)
//    return lpieces.reduce((accu, lpiece) => `${accu}, ${lpiece.toString()}`, '')
// }

// export function testMoves(): string {
//    const moves: Move[] = currentChess.possibleMoves()
//    // return moves.reduce((accu, move) => `${accu}, ${move.toString()}`, '')
//    let accu = ''
//    for (let i = 0; i < moves.length; i++) {
//       const move = moves[i]
//       accu += move.toString() + '\n' + move.resultingChess.toAscii() + '\n'
//    }
//    return accu
// }


export function createInitialBoard(): Chess {
   return Chess.createInitialBoard()
}

export function chessToAscii(chess: Chess): string {
   return chess.toAscii()
}

export function moveToString(move: Move): string {
   return move.toString()
}

export function moveResultingChess(move: Move): Chess {
   return move.resultingChess
}

export function chessPossibleMoves(chess: Chess): Move[] {
   return chess.possibleMoves()
}
