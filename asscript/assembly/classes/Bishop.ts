import { PieceType, Piece } from "./Piece"
import { Square } from "./Square"
import { MoveType, Move } from "./Move"
import { Chess } from "./Chess"


export class Bishop extends Piece {

   constructor(isWhite: bool, square: Square) {
      super(PieceType.BISHOP, isWhite, square)
   }

   clone(): Piece {
      return new Bishop(this.isWhite, this.square)
   }

   possibleMoves(chess: Chess, king: Piece): Move[] {
      console.log('bishop possibleMoves')
      const accu: Move[] = []
      // try moves on both diagonals
      const rowIncr: i8 = chess.isWhitePlayer ? 1 : -1
      for (let colIncr: i8 = -1; colIncr < 2; colIncr += 2) {
         let square = this.square.clone()
         // console.log('square0 ' + square.toString())
         // console.log('colIncr ' + colIncr.toString() + ' rowIncr ' + rowIncr.toString())
         while (true) {
            square = square.move(rowIncr, colIncr)
            if (!square.isValid()) break
            // console.log('square ' + square.toString() + (chess.isSquareEmpty(square) ? ' empty' : ' not empty'))
            const piece = chess.pieceAtSquare(square)
            if (piece === null) {
               const resultingChess = chess.cloneWithMovedPiece(this, square)
               if (!resultingChess.inCheck(king)) {
                  const move = new Move(MoveType.MOVE, this, square, null, resultingChess)
                  accu.push(move)
               }
            } else {
               if (piece.isWhite !== chess.isWhitePlayer) {
                  // const resultingChess = chess.clone().eatPiece(this, piece)
                  // if (!resultingChess.inCheck(king)) {
                  //    const move = new Move(MoveType.EAT, this, square, null, resultingChess)
                  //    accu.push(move)
                  // }
               }
               break
            }
         }
      }
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
         if (!chess.isSquareEmpty(new Square(row, col))) return false
         row = srow > trow ? row-1 : row+1
         col = scol > tcol ? col-1 : col+1
      }
      // `this` is able to freely move to target square: attacks it!
      return true
   }

}
