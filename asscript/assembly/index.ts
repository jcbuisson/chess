// The entry file of your WebAssembly module.

import { PieceType, Piece } from './classes/Piece'
import { Move } from './classes/Move'
import { LocatedPiece } from './classes/LocatedPiece'
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


function createInitialBoard(): Chess {
   return new Chess(
      [
         [new Piece(PieceType.ROOK, false),  new Piece(PieceType.KNIGHT, false),  new Piece(PieceType.BISHOP, false),  new Piece(PieceType.QUEEN, false),  new Piece(PieceType.KING, false),  new Piece(PieceType.BISHOP, false),  new Piece(PieceType.KNIGHT, false),  new Piece(PieceType.ROOK, false)],
         [new Piece(PieceType.PAWN, false),  new Piece(PieceType.PAWN, false),    new Piece(PieceType.PAWN, false),    new Piece(PieceType.PAWN, false),   new Piece(PieceType.PAWN, false),  new Piece(PieceType.PAWN, false),    new Piece(PieceType.PAWN, false),    new Piece(PieceType.PAWN, false)],
         [null,                              null,                                null,                                null,                               null,                              null,                                null,                                null],
         [null,                              null,                                null,                                null,                               null,                              null,                                null,                                null],
         [null,                              null,                                null,                                null,                               null,                              null,                                null,                                null],
         [null,                              null,                                null,                                null,                               null,                              null,                                null,                                null],
         [new Piece(PieceType.PAWN, true),   new Piece(PieceType.PAWN, true),     new Piece(PieceType.PAWN, true),     new Piece(PieceType.PAWN, true),    new Piece(PieceType.PAWN, true),   new Piece(PieceType.PAWN, true),     new Piece(PieceType.PAWN, true),     new Piece(PieceType.PAWN, true)],
         [new Piece(PieceType.ROOK, true),   new Piece(PieceType.KNIGHT, true),   new Piece(PieceType.BISHOP, true),   new Piece(PieceType.QUEEN, true),   new Piece(PieceType.KING, false),  new Piece(PieceType.BISHOP, true),   new Piece(PieceType.KNIGHT, true),   new Piece(PieceType.ROOK, true)],
      ],
      true, // white to move
      true, // king castling possible
      true, // queen castling possible
   )
}


// global state
const currentChess: Chess = createInitialBoard()

export function testChessToAscii(): string {
   return currentChess.toAscii()
}

export function testLocatedPieces(): string {
   const lpieces: LocatedPiece[] = currentChess.locatedPieces()
   return lpieces.reduce((accu, lpiece) => `${accu}, ${lpiece.toString()}`, '')
}

export function testMoves(): string {
   const moves: Move[] = currentChess.possibleMoves()
   return moves.reduce((accu, move) => `${accu}, ${move.toString()}`, '')
}
