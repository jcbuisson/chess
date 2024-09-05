import { PieceType, Piece } from "./Piece";
import { LocatedPiece } from "./LocatedPiece";
import { Square } from "./Square";
import { Chess } from "./Chess";


export class LocatedBishop extends LocatedPiece {

   constructor(isWhite: bool, square: Square) {
      super(new Piece(PieceType.BISHOP, isWhite), square)
   }

   // return true if current located piece attacks `target` located piece
   attacks(chess: Chess, target: LocatedPiece): bool {
      const srow = this.square.rowIndex
      const scol = this.square.colIndex
      const trow = target.square.rowIndex
      const tcol = target.square.colIndex
      const drow = srow > trow ? srow-trow : trow-srow
      const dcol = scol > tcol ? scol-tcol : tcol-scol
      if (drow !== dcol) return false
      let row = srow > trow ? srow-1 : srow+1
      let col = scol > tcol ? scol-1 : scol+1
      while (row !== trow) {
         if (!chess.isSquareEmpty(row, col)) return false
         row = srow > trow ? row-1 : row+1
         col = scol > tcol ? col-1 : col+1
      }
      return true
   }

}
