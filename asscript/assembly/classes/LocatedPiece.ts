
import { Piece, PieceType } from './Piece'
import { Square } from './Square'

export class LocatedPiece {
   constructor(
      public piece: Piece,
      public square: Square,
   ) {
   }

   static dummy: LocatedPiece = new LocatedPiece(new Piece(PieceType.PAWN, true), new Square(0, 0))

   toString(): string {
      return this.piece.toString() + this.square.toString()
   }
}
