
import { Square } from './Square'
import { Piece } from './Piece'
import { Chess } from './Chess'


type Nullable<T> = T | null


export enum MoveType {
   MOVE,    // 0
   EAT,     // 1
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
      return this.piece.toTypeString() + ' ' + this.piece.square.toString() + '-' + this.to.toString()
   }
}
