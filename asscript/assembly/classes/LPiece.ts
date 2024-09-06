
import { Square } from './Square'
import { Chess } from './Chess'
import { LBishop } from './LBishop'


export enum PieceType {
   PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING,
}

export class LPiece {
   constructor(
      public type: PieceType,
      public isWhite: bool,
      public square: Square,
   ) {
   }

   clone() : LPiece {
      if (this.type === PieceType.BISHOP) {
         return new LBishop(this.isWhite, this.square.clone())
      }
      return new LPiece(this.type, this.isWhite, this.square.clone())
   }

   isPawn(): bool {
      return this.type === PieceType.PAWN
   }

   isKnight(): bool {
      return this.type === PieceType.KNIGHT
   }

   isBishop(): bool {
      return this.type === PieceType.BISHOP
   }

   isRook(): bool {
      return this.type === PieceType.ROOK
   }

   isQueen(): bool {
      return this.type === PieceType.QUEEN
   }

   isKing(): bool {
      return this.type === PieceType.KING
   }

   static dummy: LPiece = new LPiece(PieceType.PAWN, true, new Square(0, 0))

   toString(): string {
      return this.toTypeString() + this.square.toString()
   }

   toTypeString(): string {
      const s = "prnbqk".charAt(this.type)
      return this.isWhite ? s.toUpperCase() : s
   }

   attacks(chess: Chess, target: LPiece): bool {
      return false
   }

}
