
// import { Piece } from './Piece'
import { Square } from './Square'
import { LPiece } from './LPiece'
import { Chess } from './Chess'


type Nullable<T> = T | null


export enum MoveType {
   MOVE,    // 0
   EAT,     // 1
}

export class Move {
   constructor(
      public type: MoveType,
      public locatedPiece: LPiece,
      public to: Square,
      public promotion: Nullable<LPiece>,
      public resultingChess: Chess,
   ) {
   }

   toString(): string {
      return this.locatedPiece.toTypeString() + ' ' + this.locatedPiece.square.toString() + '-' + this.to.toString()
   }
}
