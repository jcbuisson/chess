
import { Piece } from './Piece'
import { Square } from './Square'
import { LocatedPiece } from './LocatedPiece'
import { MoveType, Move } from './Move'

type Nullable<T> = T | null

function row2ascii(row: Array<Nullable<Piece>>): string {
   return row.reduce((accu, piece) => `${accu} ${piece ? piece.toString(): '.'} `, '')
}

export class Chess {
   constructor(
      public rows: Array<Array<Nullable<Piece>>>,
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

   pieceAt(row: u8, col: u8): Nullable<Piece> {
      return this.rows[row][col]
   }

   isSquareEmpty(row: u8, col: u8): boolean {
      return this.rows[row][col] === null
   }

   move(move: Move): void {
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

   possibleMoves(): Move[] {
      const accu: Move[] = []
      const lpieces = this.locatedPieces()
      for (let i = 0; i < lpieces.length; i++) {
         const locatedPiece = lpieces.at(i)
         // console.log(`${locatedPiece.toString()}`)
         if (locatedPiece.piece.isPawn()) {
            let targetRow: u8 = locatedPiece.piece.isWhite ? locatedPiece.square.rowIndex - 1 : locatedPiece.square.rowIndex + 1
            // console.log(`checking ${targetRow} ${locatedPiece.square.colIndex}`)
            if (targetRow >= 0 && targetRow <= 7 && this.isSquareEmpty(targetRow, locatedPiece.square.colIndex)) {
               // console.log(`empty ${targetRow} ${locatedPiece.square.colIndex}`)
               accu.push(new Move(MoveType.MOVE, locatedPiece, new Square(targetRow, locatedPiece.square.colIndex), null, this))
            }
            const hasNotMoved: boolean = locatedPiece.piece.isWhite ? locatedPiece.square.rowIndex === 6 : locatedPiece.square.rowIndex === 1
            if (hasNotMoved) {
               targetRow = locatedPiece.piece.isWhite ? locatedPiece.square.rowIndex - 2 : locatedPiece.square.rowIndex + 2
               // console.log(`checking ${targetRow} ${locatedPiece.square.colIndex}`)
               if (targetRow >= 0 && targetRow <= 7 && this.isSquareEmpty(targetRow, locatedPiece.square.colIndex)) {
                  // console.log(`empty ${targetRow} ${locatedPiece.square.colIndex}`)
                  accu.push(new Move(MoveType.MOVE, locatedPiece, new Square(targetRow, locatedPiece.square.colIndex), null, this))
               }
            }
         }
      }
      return accu
   }
}
