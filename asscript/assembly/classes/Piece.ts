
export enum PieceType {
   PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING,
}

export class Piece {
   constructor(
      public type: PieceType,
      public isWhite: bool,
   ) {
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

   toString(): string {
      let s = "prnbqk".charAt(this.type)
      return this.isWhite ? s.toUpperCase() : s
   }
}
