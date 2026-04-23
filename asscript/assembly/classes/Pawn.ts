import { PieceType, Piece } from "./Piece"
import { Square } from "./Square"
import { Chess } from "./Chess"
import { MoveType, Move } from "./Move"


export class Pawn extends Piece {

   constructor(isWhite: bool, square: Square) {
      super(PieceType.PAWN, isWhite, square)
   }

   clone(): Piece {
      return new Pawn(this.isWhite, this.square)
   }

   possibleMoves(chess: Chess): Move[] {
      const accu: Move[] = []
      // try 1-square move
      let incrRow: i8 = this.isWhite ? 1 : -1
      let targetSquare = this.square.move(incrRow, 0)
      if (chess.isSquareEmpty(targetSquare)) {
         if (targetSquare.rowIndex === Square.promotionRow(this.isWhite)) {
            // promotion
            const promotionPieceType = PieceType.QUEEN
            const resultingChess = chess.cloneWithMovedPieceWithPromotion(this, targetSquare, promotionPieceType)
            if (!resultingChess.inCheck(this.isWhite)) {
               const move = new Move(MoveType.MOVE, this, targetSquare, promotionPieceType, resultingChess)
               accu.push(move)
            }
         } else {
            // simple 1-square move
            const resultingChess = chess.cloneWithMovedPiece(this, targetSquare)
            if (!resultingChess.inCheck(this.isWhite)) {
               const move = new Move(MoveType.MOVE, this, targetSquare, PieceType.NONE, resultingChess)
               accu.push(move)
            }
         }
         if (this.square.rowIndex === Square.pawnRow(this.isWhite)) {
            // pawn is still on its starting row: try 2-square move
            incrRow = this.isWhite ? 2 : - 2
            targetSquare = this.square.move(incrRow, 0)
            if (chess.isSquareEmpty(targetSquare)) {
               const resultingChess = chess.cloneWithMovedPiece(this, targetSquare)
               if (!resultingChess.inCheck(this.isWhite)) {
                  const move = new Move(MoveType.MOVE, this, targetSquare, PieceType.NONE, resultingChess)
                  accu.push(move)
               }
            }
         }
      }
      // try eat left
      incrRow = this.isWhite ? 1 : -1
      targetSquare = this.square.move(incrRow, -1)
      let attackedPiece = chess.pieceAtSquare(targetSquare)
      if (!attackedPiece.isNull() && attackedPiece.isWhite !== this.isWhite) {
         if (targetSquare.rowIndex === Square.promotionRow(this.isWhite)) {
            // eat & promotion
            const promotionPieceType = PieceType.QUEEN
            const resultingChess = chess.cloneWithEatenPieceWithPromotion(this, attackedPiece, promotionPieceType)
            if (!resultingChess.inCheck(this.isWhite)) {
               const move = new Move(MoveType.EAT, this, targetSquare, promotionPieceType, resultingChess)
               accu.push(move)
            }
         } else {
            // simple eat
            const resultingChess = chess.cloneWithEatenPiece(this, attackedPiece)
            if (!resultingChess.inCheck(this.isWhite)) {
               const move = new Move(MoveType.EAT, this, targetSquare, PieceType.NONE, resultingChess)
               accu.push(move)
            }
         }
      }
      // try eat right
      incrRow = this.isWhite ? 1 : -1
      targetSquare = this.square.move(incrRow, 1)
      attackedPiece = chess.pieceAtSquare(targetSquare)
      if (!attackedPiece.isNull() && attackedPiece.isWhite !== this.isWhite) {
         if (targetSquare.rowIndex === Square.promotionRow(this.isWhite)) {
            // eat & promotion
            const promotionPieceType = PieceType.QUEEN
            const resultingChess = chess.cloneWithEatenPieceWithPromotion(this, attackedPiece, promotionPieceType)
            if (!resultingChess.inCheck(this.isWhite)) {
               const move = new Move(MoveType.EAT, this, targetSquare, promotionPieceType, resultingChess)
               accu.push(move)
            }
         } else {
            // simple eat
            const resultingChess = chess.cloneWithEatenPiece(this, attackedPiece)
            if (!resultingChess.inCheck(this.isWhite)) {
               const move = new Move(MoveType.EAT, this, targetSquare, PieceType.NONE, resultingChess)
               accu.push(move)
            }
         }
      }
      return accu
   }

   // return true if current pawn piece attacks opponent's `square`
   // do not use Math.abs since u8 cannot be negative
   attacks(chess: Chess, square: Square): bool {
      const dcol = square.colIndex > this.square.colIndex ? square.colIndex-this.square.colIndex : this.square.colIndex-square.colIndex
      if (dcol !== 1) return false
      if (this.isWhite) {
         return ((this.square.rowIndex + 1) === square.rowIndex)
      } else {
         return ((this.square.rowIndex - 1) === square.rowIndex)
      }
   }

}
