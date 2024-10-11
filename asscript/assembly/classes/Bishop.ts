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

   possibleMoves(chess: Chess, king: Piece): Move[] {
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
               if (!resultingChess.inCheck(king)) {
                  const move = new Move(MoveType.MOVE, this, square, null, resultingChess)
                  accu.push(move)
               }
            } else {
               if (piece.isWhite !== chess.isWhitePlayer) {
                  const resultingChess = chess.cloneWithEatenPiece(this, piece)
                  if (!resultingChess.inCheck(king)) {
                     const move = new Move(MoveType.EAT, this, square, null, resultingChess)
                     accu.push(move)
                  }
               }
               break
            }
         }
      }
      return accu
   }

   // return true if current piece attacks opponent's `target` piece
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
         if (!chess.isSquareEmpty(new Square(row, col))) return false
         row = srow > trow ? row-1 : row+1
         col = scol > tcol ? col-1 : col+1
      }
      // `this` is able to freely move to target square: attacks it!
      return true
   }

}
