import { PieceType, Piece } from "./Piece"
import { Square } from "./Square"
import { MoveType, Move } from "./Move"
import { Chess } from "./Chess"


const JUMPS: i8[][] = [[0, 1], [0, -1], [-1, 1], [-1, 0], [-1, -1], [1, 1], [1, 0], [1, -1]]

export class King extends Piece {

   constructor(isWhite: bool, square: Square) {
      super(PieceType.KING, isWhite, square)
   }

   clone(): Piece {
      return new King(this.isWhite, this.square)
   }

   // king castlings are not here, but in Chess.possibleMoves
   possibleMoves(chess: Chess): Move[] {
      const accu: Move[] = []
      // try the 8 possible jumps
      for (let i = 0; i < JUMPS.length; i++) {
         const rowCol = JUMPS[i]
         let square = this.square.clone()
         square = square.move(rowCol[0], rowCol[1])
         if (square.isValid()) {
            const piece = chess.pieceAtSquare(square)
            if (piece.isNull()) {
               const resultingChess = chess.cloneWithMovedPiece(this, square)
               if (!resultingChess.inCheck(this.isWhite)) {
                  const move = new Move(MoveType.MOVE, this, square, PieceType.NONE, resultingChess)
                  accu.push(move)
                  if (this.isWhite) resultingChess.isWhiteKingCastlingPossible = false; else resultingChess.isBlackKingCastlingPossible = false
                  if (this.isWhite) resultingChess.isWhiteQueenCastlingPossible = false; else resultingChess.isBlackQueenCastlingPossible = false
               }
            } else {
               if (piece.isWhite !== this.isWhite) {
                  const resultingChess = chess.cloneWithEatenPiece(this, piece)
                  if (!this.isWhite) console.log(`king ${this.toString()} eat piece=${piece.toString()}, chess=${chess.print()}, result=${resultingChess.print()}, inCheck=${resultingChess.inCheck(this.isWhite)}`)

                  if (!resultingChess.inCheck(this.isWhite)) {
                     const move = new Move(MoveType.EAT, this, square, PieceType.NONE, resultingChess)
                     accu.push(move)
                     if (this.isWhite) resultingChess.isWhiteKingCastlingPossible = false; else resultingChess.isBlackKingCastlingPossible = false
                     if (this.isWhite) resultingChess.isWhiteQueenCastlingPossible = false; else resultingChess.isBlackQueenCastlingPossible = false
                  }
               }
            }
         }
      }
      return accu
   }

   // return true if current piece (knight) attacks opponent `square`
   attacks(chess: Chess, square: Square): bool {
      return Math.abs(this.square.rowIndex - square.rowIndex) +  Math.abs(this.square.colIndex - square.colIndex) === 1
   }

}
