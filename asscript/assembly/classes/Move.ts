
import { Square } from './Square'
import { Piece } from './Piece'
import { Chess } from './Chess'


type Nullable<T> = T | null


export enum MoveType {
   MOVE,           // 0
   EAT,            // 1
   KING_CASTLING,  // 2
   QUEEN_CASTLING, // 3
}

export class Move {
   constructor(
      public type: MoveType,
      public piece: Piece,
      public to: Square,
      public promotion: Nullable<Piece>,
      public resultingChess: Chess,
   ) {
   }

   toString(): string {
      if (this.type === MoveType.MOVE) {
         return this.piece.toTypeString() + ' ' + this.piece.square.toString() + "-" + this.to.toString()
      } else if (this.type === MoveType.EAT) {
         return this.piece.toTypeString() + ' ' + this.piece.square.toString() + "x" + this.to.toString()
      } else if (this.type === MoveType.KING_CASTLING) {
         return this.piece.toTypeString() + " O-O"
      } else if (this.type === MoveType.QUEEN_CASTLING) {
         return this.piece.toTypeString() + " O-O-O"
      }
      // should never go there
      return ""
   }
}
