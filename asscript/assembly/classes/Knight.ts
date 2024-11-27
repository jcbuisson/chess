import { PieceType, Piece } from "./Piece"
import { Square } from "./Square"
import { MoveType, Move } from "./Move"
import { Chess } from "./Chess"


const JUMPS: i8[][] = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]


export class Knight extends Piece {

   constructor(isWhite: bool, square: Square) {
      super(PieceType.KNIGHT, isWhite, square)
   }

   clone(): Piece {
      return new Knight(this.isWhite, this.square)
   }
   
   possibleMoves(chess: Chess, kingSquare: Square): Move[] {
      const accu: Move[] = []
      for (let i = 0; i < JUMPS.length; i++) {
         const rowCol = JUMPS[i]
         let square = this.square.clone()
         square = square.move(rowCol[0], rowCol[1])
         if (square.isValid()) {
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
            }
         }
      }
      return accu
   }

   // return true if current piece (knight) attacks opponent `square`
   attacks(chess: Chess, square: Square): bool {
      // do not use Math.abs(srow-trow) since srow-trow is u8 and cannot be negative
      const drow = this.square.rowIndex > square.rowIndex ? this.square.rowIndex - square.rowIndex : square.rowIndex - this.square.rowIndex
      const dcol = this.square.colIndex > square.colIndex ? this.square.colIndex - square.colIndex : square.colIndex - this.square.colIndex
      if (drow === 2 && dcol === 1) return true
      if (drow === 1 && dcol === 2) return true
      return false
   }

}
