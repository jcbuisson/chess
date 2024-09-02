
import { PieceType, Piece } from './Piece'
import { Square } from './Square'
import { LocatedPiece } from './LocatedPiece'
import { MoveType, Move } from './Move'

type Nullable<T> = T | null


function row2ascii(row: Array<Nullable<Piece>>): string {
   return row.reduce((accu, piece) => `${accu} ${piece ? piece.toString(): '.'} `, '')
}

export class Chess {
   constructor(
      // public rows: Array<Array<Nullable<Piece>>>,
      public rows: Nullable<Piece>[][],
      public isWhiteToMove: boolean,
      public isKingCastlingPossible: boolean,
      public isQueenCastlingPossible: boolean,
   ) {
   }

   toAscii(): string {
      return`  +------------------------+
8 |${row2ascii(this.rows.at(0))}|
7 |${row2ascii(this.rows.at(1))}|
6 |${row2ascii(this.rows.at(2))}|
5 |${row2ascii(this.rows.at(3))}|
4 |${row2ascii(this.rows.at(4))}|
3 |${row2ascii(this.rows.at(5))}|
2 |${row2ascii(this.rows.at(6))}|
1 |${row2ascii(this.rows.at(7))}|
  +------------------------+
    a  b  c  d  e  f  g  h`
   }

   static createInitialBoard(): Chess {
      return new Chess(
         [
            [new Piece(PieceType.ROOK, false),  new Piece(PieceType.KNIGHT, false),  new Piece(PieceType.BISHOP, false),  new Piece(PieceType.QUEEN, false),  new Piece(PieceType.KING, false),  new Piece(PieceType.BISHOP, false),  new Piece(PieceType.KNIGHT, false),  new Piece(PieceType.ROOK, false)],
            [new Piece(PieceType.PAWN, false),  new Piece(PieceType.PAWN, false),    new Piece(PieceType.PAWN, false),    new Piece(PieceType.PAWN, false),   new Piece(PieceType.PAWN, false),  new Piece(PieceType.PAWN, false),    new Piece(PieceType.PAWN, false),    new Piece(PieceType.PAWN, false)],
            [null,                              null,                                null,                                null,                               null,                              null,                                null,                                null],
            [null,                              null,                                null,                                null,                               null,                              null,                                null,                                null],
            [null,                              null,                                null,                                null,                               null,                              null,                                null,                                null],
            [null,                              null,                                null,                                null,                               null,                              null,                                null,                                null],
            [new Piece(PieceType.PAWN, true),   new Piece(PieceType.PAWN, true),     new Piece(PieceType.PAWN, true),     new Piece(PieceType.PAWN, true),    new Piece(PieceType.PAWN, true),   new Piece(PieceType.PAWN, true),     new Piece(PieceType.PAWN, true),     new Piece(PieceType.PAWN, true)],
            [new Piece(PieceType.ROOK, true),   new Piece(PieceType.KNIGHT, true),   new Piece(PieceType.BISHOP, true),   new Piece(PieceType.QUEEN, true),   new Piece(PieceType.KING, false),  new Piece(PieceType.BISHOP, true),   new Piece(PieceType.KNIGHT, true),   new Piece(PieceType.ROOK, true)],
         ],
         true, // white to move
         true, // king castling possible
         true, // queen castling possible
      )   
   }

   clone() : Chess {
      return new Chess(
         [
            [this.rows[0][0], this.rows[0][1], this.rows[0][2], this.rows[0][3], this.rows[0][4], this.rows[0][5], this.rows[0][6], this.rows[0][7], ],
            [this.rows[1][0], this.rows[1][1], this.rows[1][2], this.rows[1][3], this.rows[1][4], this.rows[1][5], this.rows[1][6], this.rows[1][7], ],
            [this.rows[2][0], this.rows[2][1], this.rows[2][2], this.rows[2][3], this.rows[2][4], this.rows[2][5], this.rows[2][6], this.rows[2][7], ],
            [this.rows[3][0], this.rows[3][1], this.rows[3][2], this.rows[3][3], this.rows[3][4], this.rows[3][5], this.rows[3][6], this.rows[3][7], ],
            [this.rows[4][0], this.rows[4][1], this.rows[4][2], this.rows[4][3], this.rows[4][4], this.rows[4][5], this.rows[4][6], this.rows[4][7], ],
            [this.rows[5][0], this.rows[5][1], this.rows[5][2], this.rows[5][3], this.rows[5][4], this.rows[5][5], this.rows[5][6], this.rows[5][7], ],
            [this.rows[6][0], this.rows[6][1], this.rows[6][2], this.rows[6][3], this.rows[6][4], this.rows[6][5], this.rows[6][6], this.rows[6][7], ],
            [this.rows[7][0], this.rows[7][1], this.rows[7][2], this.rows[7][3], this.rows[7][4], this.rows[7][5], this.rows[7][6], this.rows[7][7], ],
         ],
         this.isWhiteToMove,
         this.isKingCastlingPossible,
         this.isQueenCastlingPossible
      )
   }

   pieceAt(row: u8, col: u8): Nullable<Piece> {
      return this.rows[row][col]
   }

   setPieceAt(square: Square, piece: Nullable<Piece>) : Chess {
      this.rows[square.rowIndex][square.colIndex] = piece
      return this
   }

   isSquareEmpty(row: u8, col: u8): boolean {
      return this.rows[row][col] === null
   }

   locatedPieces(): LocatedPiece[] {
      const accu: LocatedPiece[] = []
      for (let row: u8 = 0; row < 8; row++) {
         for (let col: u8 = 0; col < 8; col++) {
            const piece = this.pieceAt(row, col)
            if (piece) accu.push(new LocatedPiece(piece, new Square(row, col)))
         }
      }
      return accu
   }

   // indicates if the side to move is in check
   inCheck(): boolean {

      return false
   }

   possibleMoves(): Move[] {
      const accu: Move[] = []
      const lpieces = this.locatedPieces()
      for (let i = 0; i < lpieces.length; i++) {
         const locatedPiece = lpieces.at(i)
         // console.log(`${locatedPiece.toString()}`)
         if (locatedPiece.piece.isPawn()) {
            const targetRow: u8 = locatedPiece.piece.isWhite ? locatedPiece.square.rowIndex - 1 : locatedPiece.square.rowIndex + 1
            // console.log(`checking ${targetRow} ${locatedPiece.square.colIndex}`)
            if (targetRow >= 0 && targetRow <= 7 && this.isSquareEmpty(targetRow, locatedPiece.square.colIndex)) {
               // console.log(`empty ${targetRow} ${locatedPiece.square.colIndex}`)
               const targetSquare = new Square(targetRow, locatedPiece.square.colIndex)
               const resultingChess = this.clone().setPieceAt(targetSquare, locatedPiece.piece).setPieceAt(locatedPiece.square, null)
               accu.push(new Move(MoveType.MOVE, locatedPiece, targetSquare, null, resultingChess))
            }
            const hasNotMoved: boolean = locatedPiece.piece.isWhite ? locatedPiece.square.rowIndex === 6 : locatedPiece.square.rowIndex === 1
            if (hasNotMoved) {
               const targetRow = locatedPiece.piece.isWhite ? locatedPiece.square.rowIndex - 2 : locatedPiece.square.rowIndex + 2
               // console.log(`checking ${targetRow} ${locatedPiece.square.colIndex}`)
               if (targetRow >= 0 && targetRow <= 7 && this.isSquareEmpty(targetRow, locatedPiece.square.colIndex)) {
                  // console.log(`empty ${targetRow} ${locatedPiece.square.colIndex}`)
                  const targetSquare = new Square(targetRow, locatedPiece.square.colIndex)
                  const resultingChess = this.clone().setPieceAt(targetSquare, locatedPiece.piece).setPieceAt(locatedPiece.square, null)
                  accu.push(new Move(MoveType.MOVE, locatedPiece, targetSquare, null, resultingChess))
               }
            }
         }
      }
      // remove moves from `accu` where resulting position is in check for the side to move
      return accu.filter(move => !move.resultingChess.inCheck())
   }
}
