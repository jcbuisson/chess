
import { Piece } from './Piece'
import { Square } from './Square'

export class LocatedPiece {
   constructor(
      public piece: Piece,
      public square: Square,
   ) {
   }

   toString(): string {
      return this.piece.toString() + this.square.toString()
   }
}
