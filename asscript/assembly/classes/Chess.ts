
import { PieceType, Piece } from './Piece'
import { Square } from './Square'
import { LocatedPiece } from './LocatedPiece'
import { MoveType, Move } from './Move'

type Nullable<T> = T | null


function row2ascii(row: Array<Nullable<Piece>>): string {
   return row.reduce((accu, piece) => `${accu} ${piece ? piece.toString(): '.'} `, '')
}

// rnbkqbnrpppppppp..............................PPPPPPPPRNBQKBNR
// r00n01b02k03
// liste de LocatedPiece
export class Chess {
   constructor(
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
            [new Piece(PieceType.ROOK, false),  new Piece(PieceType.KNIGHT, false),  new Piece(PieceType.BISHOP, false),  new Piece(PieceType.QUEEN, false),  new Piece(PieceType.KING, false),  null,  new Piece(PieceType.KNIGHT, false),  new Piece(PieceType.ROOK, false)],
            [new Piece(PieceType.PAWN, false),  new Piece(PieceType.PAWN, false),    new Piece(PieceType.PAWN, false),    new Piece(PieceType.PAWN, false),   new Piece(PieceType.PAWN, false),  new Piece(PieceType.PAWN, false),    new Piece(PieceType.PAWN, false),    new Piece(PieceType.PAWN, false)],
            [null,                              null,                                null,                                null,                               null,                              null,                                null,                                null],
            [null,                              null,                                null,                                null,                               null,                              null,                                null,                                null],
            [null,                              null,                                null,                                null,                               null,                              null,                                null,                                new Piece(PieceType.BISHOP, false)],
            [null,                              null,                                null,                                null,                               null,                              null,                                null,                                null],
            [new Piece(PieceType.PAWN, true),   new Piece(PieceType.PAWN, true),     new Piece(PieceType.PAWN, true),     new Piece(PieceType.PAWN, true),    new Piece(PieceType.PAWN, true),   new Piece(PieceType.PAWN, true),     new Piece(PieceType.PAWN, true),     new Piece(PieceType.PAWN, true)],
            [new Piece(PieceType.ROOK, true),   new Piece(PieceType.KNIGHT, true),   new Piece(PieceType.BISHOP, true),   new Piece(PieceType.QUEEN, true),   new Piece(PieceType.KING, true),  new Piece(PieceType.BISHOP, true),   new Piece(PieceType.KNIGHT, true),   new Piece(PieceType.ROOK, true)],
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

   attacks(sourcePiece: LocatedPiece, targetPiece: LocatedPiece): bool {
      if (sourcePiece.piece.isBishop()) {
         const srow = sourcePiece.square.rowIndex
         const scol = sourcePiece.square.colIndex
         const trow = targetPiece.square.rowIndex
         const tcol = targetPiece.square.colIndex
         const drow = srow > trow ? srow-trow : trow-srow
         const dcol = scol > tcol ? scol-tcol : tcol-scol
         if (drow !== dcol) return false
         let row = srow > trow ? srow-1 : srow+1
         let col = scol > tcol ? scol-1 : scol+1
         while (row !== trow) {
            if (!this.isSquareEmpty(row, col)) return false
            row = srow > trow ? row-1 : row+1
            col = scol > tcol ? col-1 : col+1
         }
         return true
      }
      return false
   }

   setPieceAt(square: Square, piece: Nullable<Piece>) : Chess {
      this.rows[square.rowIndex][square.colIndex] = piece
      return this
   }

   isSquareEmpty(row: u8, col: u8): bool {
      return this.rows[row][col] === null
   }

   toMoveLocatedPieces(): LocatedPiece[] {
      const accu: LocatedPiece[] = []
      for (let row: u8 = 0; row < 8; row++) {
         for (let col: u8 = 0; col < 8; col++) {
            const piece = this.pieceAt(row, col)
            if (piece && piece.isWhite === this.isWhiteToMove) accu.push(new LocatedPiece(piece, new Square(row, col)))
         }
      }
      return accu
   }

   opponentLocatedPieces(): LocatedPiece[] {
      const accu: LocatedPiece[] = []
      for (let row: u8 = 0; row < 8; row++) {
         for (let col: u8 = 0; col < 8; col++) {
            const piece = this.pieceAt(row, col)
            if (piece && piece.isWhite !== this.isWhiteToMove) accu.push(new LocatedPiece(piece, new Square(row, col)))
         }
      }
      return accu
   }

   toMoveLocatedKing(): LocatedPiece {
      const toMoveLPieces = this.toMoveLocatedPieces()
      for (let i = 0; i < toMoveLPieces.length; i++) {
         const lpiece = toMoveLPieces[i]
         if (lpiece.piece.type === PieceType.KING && lpiece.piece.isWhite === this.isWhiteToMove) return lpiece
      }
      return LocatedPiece.dummy // should never happen
   }


   // indicates if the side to move is in check
   inCheck(king: LocatedPiece): bool {
      const opponentLPieces = this.opponentLocatedPieces()
      for (let i = 0; i < opponentLPieces.length; i++) {
         const lpiece = opponentLPieces[i]
         if (this.attacks(lpiece, king)) return true
      }
      return false
   }

   possibleMoves(): Move[] {
      const accu: Move[] = []
      const lpieces = this.toMoveLocatedPieces()
      const king = this.toMoveLocatedKing()
      console.log(`king ${king.toString()}`)
      for (let i = 0; i < lpieces.length; i++) {
         const locatedPiece = lpieces.at(i)
         // console.log(`${locatedPiece.toString()}`)
         if (locatedPiece.piece.isPawn()) {
            const targetRow: u8 = locatedPiece.piece.isWhite ? locatedPiece.square.rowIndex - 1 : locatedPiece.square.rowIndex + 1
            if (targetRow >= 0 && targetRow <= 7 && this.isSquareEmpty(targetRow, locatedPiece.square.colIndex)) {
               // console.log(`empty ${targetRow} ${locatedPiece.square.colIndex}`)
               const targetSquare = new Square(targetRow, locatedPiece.square.colIndex)
               const resultingChess = this.clone().setPieceAt(targetSquare, locatedPiece.piece).setPieceAt(locatedPiece.square, null)
               const move = new Move(MoveType.MOVE, locatedPiece, targetSquare, null, resultingChess)
               // console.log(`move ${move.toString()} ${resultingChess.inCheck(king)}`)
               if (!resultingChess.inCheck(king)) accu.push(move)
            }
            const hasNotMoved: boolean = locatedPiece.piece.isWhite ? locatedPiece.square.rowIndex === 6 : locatedPiece.square.rowIndex === 1
            if (hasNotMoved) {
               const targetRow = locatedPiece.piece.isWhite ? locatedPiece.square.rowIndex - 2 : locatedPiece.square.rowIndex + 2
               // console.log(`checking ${targetRow} ${locatedPiece.square.colIndex}`)
               if (targetRow >= 0 && targetRow <= 7 && this.isSquareEmpty(targetRow, locatedPiece.square.colIndex)) {
                  const targetSquare = new Square(targetRow, locatedPiece.square.colIndex)
                  const resultingChess = this.clone().setPieceAt(targetSquare, locatedPiece.piece).setPieceAt(locatedPiece.square, null)
                  const move = new Move(MoveType.MOVE, locatedPiece, targetSquare, null, resultingChess)
                  // console.log(`move ${move.toString()} ${resultingChess.inCheck(king)}`)
                  if (!resultingChess.inCheck(king)) accu.push(move)
               }
            }
         }
      }
      return accu
   }
}
