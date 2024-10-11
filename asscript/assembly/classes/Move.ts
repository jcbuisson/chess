
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
      const type = this.type === MoveType.EAT ? 'x' : '-'
      return this.piece.toTypeString() + ' ' + this.piece.square.toString() + type + this.to.toString()
   }
}
