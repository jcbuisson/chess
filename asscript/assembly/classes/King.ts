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

   possibleMoves(chess: Chess, king: Piece): Move[] {
      const accu: Move[] = []
      // try the 8 possible jumps
      for (let i = 0; i < JUMPS.length; i++) {
         const rowCol = JUMPS[i]
         let square = this.square.clone()
         square = square.move(rowCol[0], rowCol[1])
         if (square.isValid()) {
            const piece = chess.pieceAtSquare(square)
            if (piece === null) {
               const resultingChess = chess.cloneWithMovedPiece(this, square)
               if (!resultingChess.inCheck(king)) {
                  const move = new Move(MoveType.MOVE, this, square, null, resultingChess)
                  accu.push(move)
                  resultingChess.isKingCastlingPossible = false
                  resultingChess.isQueenCastlingPossible = false
               }
            } else {
               if (piece.isWhite !== chess.isWhitePlayer) {
                  const resultingChess = chess.cloneWithEatenPiece(this, piece)
                  if (!resultingChess.inCheck(king)) {
                     const move = new Move(MoveType.EAT, this, square, null, resultingChess)
                     accu.push(move)
                     resultingChess.isKingCastlingPossible = false
                     resultingChess.isQueenCastlingPossible = false
                  }
               }
            }
         }
      }
      return accu
   }

   // return true if current piece (knight) attacks opponent `target` piece
   attacks(chess: Chess, target: Piece): bool {
      return Math.abs(this.square.rowIndex - target.square.rowIndex) +  Math.abs(this.square.colIndex - target.square.colIndex) === 1
   }

}
