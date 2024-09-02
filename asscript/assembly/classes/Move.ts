
import { Piece } from './Piece'
import { Square } from './Square'
import { LocatedPiece } from './LocatedPiece'
import { Chess } from './Chess'


type Nullable<T> = T | null


export enum MoveType {
   MOVE,    // 0
   EAT,     // 1
}

export class Move {
   constructor(
      public type: MoveType,
      public locatedPiece: LocatedPiece,
      public to: Square,
      public promotion: Nullable<Piece>,
      public resultingChess: Chess,
   ) {
   }

   toString(): string {
      return this.locatedPiece.piece.toString() + this.locatedPiece.square.toString() + '-' + this.to.toString()
   }
}
