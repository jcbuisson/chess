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
      const targetRow: u8 = this.isWhite ? this.square.rowIndex - 1 : this.square.rowIndex + 1
      if (targetRow >= 0 && targetRow <= 7 && chess.isSquareEmpty(targetRow, this.square.colIndex)) {
         const targetSquare = new Square(targetRow, this.square.colIndex)
         const resultingChess = chess.clone().movePiece(this.square, targetSquare)
         const move = new Move(MoveType.MOVE, this, targetSquare, null, resultingChess)
         if (!resultingChess.inCheck(king)) accu.push(move)
      }
      const hasNotMoved: boolean = this.isWhite ? this.square.rowIndex === 6 : this.square.rowIndex === 1
      if (hasNotMoved) {
         const targetRow = this.isWhite ? this.square.rowIndex - 2 : this.square.rowIndex + 2
         if (targetRow >= 0 && targetRow <= 7 && chess.isSquareEmpty(targetRow, this.square.colIndex)) {
            const targetSquare = new Square(targetRow, this.square.colIndex)
            const resultingChess = chess.clone().movePiece(this.square, targetSquare)
            const move = new Move(MoveType.MOVE, this, targetSquare, null, resultingChess)
            if (!resultingChess.inCheck(king)) accu.push(move)
         }
      }
      return accu
   }

   // return true if current located piece attacks `target` located piece
   attacks(chess: Chess, target: Piece): bool {
      return false
   }

}
