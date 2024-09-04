import { PieceType, Piece } from "./Piece";
import { Square } from "./Square";
import { LocatedPiece } from "./LocatedPiece";

export class LocatedPawn extends LocatedPiece {

   constructor(square: Square) {
      super(new Piece(PieceType.PAWN, false), square)
   }

   
      

}
