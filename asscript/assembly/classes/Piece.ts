
import { Square } from './Square'
import { Chess } from './Chess'
import { Pawn } from './Pawn'
import { Bishop } from './Bishop'
import { Move } from "./Move"


export enum PieceType {
   PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING,
}

export class Piece {
   constructor(
      public type: PieceType,
      public isWhite: bool,
      public square: Square,
   ) {
   }

   clone(): Piece {
      if (this.type === PieceType.PAWN) {
         return new Pawn(this.isWhite, this.square.clone())
      }
      if (this.type === PieceType.BISHOP) {
         return new Bishop(this.isWhite, this.square.clone())
      }
      return new Piece(this.type, this.isWhite, this.square.clone())
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

   static dummy: Piece = new Piece(PieceType.PAWN, true, new Square(0, 0))

   toString(): string {
      return this.toTypeString() + this.square.toString()
   }

   toTypeString(): string {
      const s = "prnbqk".charAt(this.type)
      return this.isWhite ? s.toUpperCase() : s
   }

   // see subclasses Pawn, Bishop etc.
   possibleMoves(chess: Chess, king: Piece): Move[] {
      return []
   }

   // see subclasses Pawn, Bishop etc.
   attacks(chess: Chess, target: Piece): bool {
      return false
   }

}
