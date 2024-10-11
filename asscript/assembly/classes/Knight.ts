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
   
   possibleMoves(chess: Chess, king: Piece): Move[] {
      const accu: Move[] = []
      for (let i = 0; i < JUMPS.length; i++) {
         const rowCol = JUMPS[i]
         let square = this.square.clone()
         square = square.move(rowCol[0], rowCol[1])
         if (square.isValid()) {
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
            }
         }
      }
      return accu
   }

   // return true if current piece (knight) attacks opponent `target` piece
   attacks(chess: Chess, target: Piece): bool {
      const rowDiff = Math.abs(this.square.rowIndex - target.square.rowIndex)
      const colDiff = Math.abs(this.square.colIndex - target.square.colIndex)
      if (rowDiff === 2 && colDiff === 1) return true
      if (rowDiff === 1 && colDiff === 2) return true
      return false
   }

}
