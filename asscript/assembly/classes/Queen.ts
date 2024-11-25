import { PieceType, Piece } from "./Piece"
import { Square } from "./Square"
import { MoveType, Move } from "./Move"
import { Chess } from "./Chess"


const DIAGJUMPS: i8[][] = [[1, -1], [1, 1], [-1, -1], [-1, 1]]
const HVJUMPS: i8[][] = [[0, -1], [0, 1], [-1, 0], [1, 0]]

export class Queen extends Piece {

   constructor(isWhite: bool, square: Square) {
      super(PieceType.QUEEN, isWhite, square)
   }

   clone(): Piece {
      return new Queen(this.isWhite, this.square)
   }

   possibleMoves(chess: Chess, kingSquare: Square): Move[] {
      const accu: Move[] = []
      // try moves on the 4 diagonal directions
      for (let i = 0; i < DIAGJUMPS.length; i++) {
         const jump = DIAGJUMPS[i]
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
                  const move = new Move(MoveType.MOVE, this, square, null, resultingChess)
                  accu.push(move)
               }
            } else {
               if (piece.isWhite !== chess.isWhitePlayer) {
                  const resultingChess = chess.cloneWithEatenPiece(this, piece)
                  if (!resultingChess.inCheck(kingSquare)) {
                     const move = new Move(MoveType.EAT, this, square, null, resultingChess)
                     accu.push(move)
                  }
               }
               break
            }
         }
      }
      // try moves on the 4 H/V directions
      for (let i = 0; i < HVJUMPS.length; i++) {
         const jump = HVJUMPS[i]
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
                  const move = new Move(MoveType.MOVE, this, square, null, resultingChess)
                  accu.push(move)
               }
            } else {
               if (piece.isWhite !== chess.isWhitePlayer) {
                  const resultingChess = chess.cloneWithEatenPiece(this, piece)
                  if (!resultingChess.inCheck(kingSquare)) {
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

   attacksAsBishop(chess: Chess, square: Square): bool {
      const srow = this.square.rowIndex
      const scol = this.square.colIndex
      const trow = square.rowIndex
      const tcol = square.colIndex
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
      // `this` is able to freely move to target square: attacks it!
      return true
   }

   attacksAsRook(chess: Chess, square: Square): bool {
      const srow = this.square.rowIndex
      const scol = this.square.colIndex
      const trow = square.rowIndex
      const tcol = square.colIndex
      if (srow === trow) {
         // they are on the same row: try to move on the row from this to `square`
         let col = scol > tcol ? scol-1 : scol+1
         while (col !== tcol) {
            if (!chess.isSquareEmpty(new Square(srow, col))) return false
            col = scol > tcol ? col-1 : col+1
         }
         return true
      } else if (scol === tcol) {
         // they are on the same column: try to move on the column from this to target
         let row = srow > trow ? srow-1 : srow+1
         while (row !== trow) {
            if (!chess.isSquareEmpty(new Square(row, scol))) return false
            row = srow > trow ? row-1 : row+1
         }
         return true
      } else {
         // they are not on the same row or on the same column
         return false
      }
   }

   // return true if current piece (queen) attacks opponent `square`
   attacks(chess: Chess, square: Square): bool {
      if (this.attacksAsBishop(chess, square)) return true
      if (this.attacksAsRook(chess, square)) return true
      return false
   }

}
