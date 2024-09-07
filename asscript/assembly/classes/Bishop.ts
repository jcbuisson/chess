import { PieceType, Piece } from "./Piece"
import { Square } from "./Square"
import { MoveType, Move } from "./Move"
import { Chess } from "./Chess"


export class Bishop extends Piece {

   constructor(isWhite: bool, square: Square) {
      super(PieceType.BISHOP, isWhite, square)
   }

   possibleMoves(chess: Chess, king: Piece): Move[] {
      const accu: Move[] = []
      return accu
   }

   // return true if current piece attacks opponent `target` piece
   attacks(chess: Chess, target: Piece): bool {
      const srow = this.square.rowIndex
      const scol = this.square.colIndex
      const trow = target.square.rowIndex
      const tcol = target.square.colIndex
      const drow = srow > trow ? srow-trow : trow-srow
      const dcol = scol > tcol ? scol-tcol : tcol-scol
      // false if they are not on the same diagonal
      if (drow !== dcol) return false
      // move on the diagonal from `this` to target
      let row = srow > trow ? srow-1 : srow+1
      let col = scol > tcol ? scol-1 : scol+1
      while (row !== trow) {
         if (!chess.isRowColEmpty(row, col)) return false
         row = srow > trow ? row-1 : row+1
         col = scol > tcol ? col-1 : col+1
      }
      // `this` is able to freely move to target square: attacks it!
      return true
   }

}
