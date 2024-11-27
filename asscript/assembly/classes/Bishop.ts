import { PieceType, Piece } from "./Piece"
import { Square } from "./Square"
import { MoveType, Move } from "./Move"
import { Chess } from "./Chess"


const JUMPS: i8[][] = [[1, -1], [1, 1], [-1, -1], [-1, 1]]

export class Bishop extends Piece {

   constructor(isWhite: bool, square: Square) {
      super(PieceType.BISHOP, isWhite, square)
   }

   clone(): Piece {
      return new Bishop(this.isWhite, this.square)
   }

   possibleMoves(chess: Chess, kingSquare: Square): Move[] {
      const accu: Move[] = []
      // try moves on the 4 diagonal directions
      for (let i = 0; i < JUMPS.length; i++) {
         const jump = JUMPS[i]
         const rowIncr = jump[0]
         const colIncr = jump[1]
         let square = this.square.clone()
         while (true) {
            square = square.move(rowIncr, colIncr)
            if (!square.isValid()) break
            const piece = chess.pieceAtSquare(square)
            if (piece === null) {
               const resultingChess = chess.cloneWithMovedPiece(this, square)
               if (!resultingChess.inCheck(kingSquare)) {
                  const move = new Move(MoveType.MOVE, this, square, PieceType.NONE, resultingChess)
                  accu.push(move)
               }
            } else {
               if (piece.isWhite !== chess.isWhitePlayer) {
                  const resultingChess = chess.cloneWithEatenPiece(this, piece)
                  if (!resultingChess.inCheck(kingSquare)) {
                     const move = new Move(MoveType.EAT, this, square, PieceType.NONE, resultingChess)
                     accu.push(move)
                  }
               }
               break
            }
         }
      }
      return accu
   }

   // return true if current piece attacks opponent's `square`
   attacks(chess: Chess, square: Square): bool {
      const srow = this.square.rowIndex
      const scol = this.square.colIndex
      const trow = square.rowIndex
      const tcol = square.colIndex
      // do not use Math.abs(srow-trow) since srow-trow is u8 and cannot be negative
      const drow = srow > trow ? srow-trow : trow-srow
      const dcol = scol > tcol ? scol-tcol : tcol-scol
      // false if they are not on the same diagonal
      if (drow !== dcol) return false
      // move on the diagonal from `this` to `square`
      let row = srow > trow ? srow-1 : srow+1
      let col = scol > tcol ? scol-1 : scol+1
      while (row !== trow) {
         if (!chess.isSquareEmpty(new Square(row, col))) return false
         row = srow > trow ? row-1 : row+1
         col = scol > tcol ? col-1 : col+1
      }
      // `this` is able to freely move to `square`: attacks it!
      return true
   }

}
