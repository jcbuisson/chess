
export enum PieceType {
   PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING,
}

export class Piece {
   constructor(
      public type: PieceType,
      public isWhite: boolean,
   ) {
   }

   isPawn(): boolean {
      return this.type === PieceType.PAWN
   }

   isKnight(): boolean {
      return this.type === PieceType.KNIGHT
   }

   isBishop(): boolean {
      return this.type === PieceType.BISHOP
   }

   isRook(): boolean {
      return this.type === PieceType.ROOK
   }

   isQueen(): boolean {
      return this.type === PieceType.QUEEN
   }

   isKing(): boolean {
      return this.type === PieceType.KING
   }

   toString(): string {
      let s = "pnbrqk".charAt(this.type)
      return this.isWhite ? s.toUpperCase() : s
   }
}
