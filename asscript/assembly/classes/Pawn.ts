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

   possibleMoves(chess: Chess, kingSquare: Square): Move[] {
      const accu: Move[] = []
      // try 1-square move
      let incrRow: i8 = this.isWhite ? 1 : -1
      let targetSquare = this.square.move(incrRow, 0)
      if (chess.isSquareEmpty(targetSquare)) {
         const resultingChess = chess.cloneWithMovedPiece(this, targetSquare)
         if (!resultingChess.inCheck(kingSquare)) {
            const move = new Move(MoveType.MOVE, this, targetSquare, PieceType.NONE, resultingChess)
            accu.push(move)
         }
         if (this.square.rowIndex === Square.pawnRow(this.isWhite)) {
            // pawn is still on its starting row: try 2-square move
            incrRow = this.isWhite ? 2 : - 2
            targetSquare = this.square.move(incrRow, 0)
            if (chess.isSquareEmpty(targetSquare)) {
               const resultingChess = chess.cloneWithMovedPiece(this, targetSquare)
               if (!resultingChess.inCheck(kingSquare)) {
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
      if (attackedPiece) {
         const resultingChess = chess.cloneWithEatenPiece(this, attackedPiece)
         if (!resultingChess.inCheck(kingSquare)) {
            const move = new Move(MoveType.EAT, this, targetSquare, PieceType.NONE, resultingChess)
            accu.push(move)
         }
      }
      // try eat right
      incrRow = this.isWhite ? 1 : -1
      targetSquare = this.square.move(incrRow, 1)
      attackedPiece = chess.pieceAtSquare(targetSquare)
      if (attackedPiece) {
         const resultingChess = chess.cloneWithEatenPiece(this, attackedPiece)
         if (!resultingChess.inCheck(kingSquare)) {
            const move = new Move(MoveType.EAT, this, targetSquare, PieceType.NONE, resultingChess)
            accu.push(move)
         }
      }
      return accu
   }

   // return true if current pawn piece attacks opponent's `square`
   attacks(chess: Chess, square: Square): bool {
      const incrRow = this.isWhite ? 1 : -1
      if (square.rowIndex - this.square.rowIndex !== incrRow) return false
      return Math.abs(square.colIndex - this.square.colIndex) === 1
   }

}
