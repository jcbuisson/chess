import { PieceType, Piece } from "./Piece"
import { Square } from "./Square"
import { Chess } from "./Chess"
import { MoveType, Move } from "./Move"


export class Pawn extends Piece {

   constructor(isWhite: bool, square: Square) {
      super(PieceType.PAWN, isWhite, square)
   }

   possibleMoves(chess: Chess, king: Piece): Move[] {
      const accu: Move[] = []
      // try 1-square move
      let incrRow: i8 = this.isWhite ? 1 : - 1
      let targetSquare = this.square.move(incrRow, 0)
      if (chess.isSquareEmpty(targetSquare)) {
         const resultingChess = chess.clone().movePiece(this.square, targetSquare)
         if (!resultingChess.inCheck(king)) {
            const move = new Move(MoveType.MOVE, this, targetSquare, null, resultingChess)
            accu.push(move)
         }
         if (this.square.rowIndex === Square.pawnRow(this.isWhite)) {
            // pawn is still on its starting row: try 2-square move
            incrRow = this.isWhite ? 2 : - 2
            targetSquare = this.square.move(incrRow, 0)
            if (chess.isSquareEmpty(targetSquare)) {
               const resultingChess = chess.clone().movePiece(this.square, targetSquare)
               if (!resultingChess.inCheck(king)) {
                  const move = new Move(MoveType.MOVE, this, targetSquare, null, resultingChess)
                  accu.push(move)
               }
            }
         }
      }
      // try eat left
      incrRow = this.isWhite ? 1 : - 1
      targetSquare = this.square.move(incrRow, -1)
      let attackedPiece = chess.pieceAt(targetSquare.rowIndex, targetSquare.colIndex)
      if (attackedPiece) {
         const resultingChess = chess.clone().deletePiece(attackedPiece).movePiece(this.square, targetSquare)
         if (!resultingChess.inCheck(king)) {
            const move = new Move(MoveType.EAT, this, targetSquare, null, resultingChess)
            accu.push(move)
         }
      }
      // try eat right
      incrRow = this.isWhite ? 1 : - 1
      targetSquare = this.square.move(incrRow, 1)
      attackedPiece = chess.pieceAt(targetSquare.rowIndex, targetSquare.colIndex)
      if (attackedPiece) {
         const resultingChess = chess.clone().deletePiece(attackedPiece).movePiece(this.square, targetSquare)
         if (!resultingChess.inCheck(king)) {
            const move = new Move(MoveType.EAT, this, targetSquare, null, resultingChess)
            accu.push(move)
         }
      }
      return accu
   }

   // return true if current located piece attacks `target` located piece
   attacks(chess: Chess, target: Piece): bool {
      return false
   }

}
