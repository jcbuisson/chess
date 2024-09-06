
// import { PieceType, Piece } from './Piece'
import { PieceType, Piece } from './Piece'
import { Bishop } from './Bishop'
import { Square } from './Square'
// import { LocatedPiece } from './LocatedPiece'
// import { LocatedBishop } from './LocatedBishop'
import { MoveType, Move } from './Move'

type Nullable<T> = T | null


export class Chess {
   constructor(
      public lPieces: Piece[],
      public isWhitePlayer: boolean,
      public isKingCastlingPossible: boolean,
      public isQueenCastlingPossible: boolean,
   ) {
   }

   toAscii(): string {
      let result = '  +------------------------+\n'
      for (let row: u8 = 0; row < 8; row++) {
         let line = ''
         for (let col: u8 = 0; col < 8; col++) {
            const p = this.pieceAt(row, col)
            const x = p === null ? '.' : p.toTypeString()
            line += ` ${x} `
         }
         result += `${8-row} |${line}|\n`
      }
      result += '  +------------------------+\n'
      result +=  '    a  b  c  d  e  f  g  h\n'
      return result
   }

   static createInitialBoard(): Chess {
      return new Chess(
         [
            new Piece(PieceType.ROOK, false, new Square(0, 0)), new Piece(PieceType.KNIGHT, false, new Square(0, 1)), new Piece(PieceType.BISHOP, false, new Square(0, 2)),  new Piece(PieceType.QUEEN, false, new Square(0, 3)), new Piece(PieceType.KING, false, new Square(0, 4)), new Bishop(false, new Square(4, 7)), new Piece(PieceType.KNIGHT, false, new Square(0, 6)), new Piece(PieceType.ROOK, false, new Square(0, 7)),
            new Piece(PieceType.PAWN, false, new Square(1, 0)), new Piece(PieceType.PAWN, false, new Square(1, 1)), new Piece(PieceType.PAWN, false, new Square(1, 2)), new Piece(PieceType.PAWN, false, new Square(1, 3)), new Piece(PieceType.PAWN, false, new Square(1, 4)), new Piece(PieceType.PAWN, false, new Square(1, 5)), new Piece(PieceType.PAWN, false, new Square(1, 6)), new Piece(PieceType.PAWN, false, new Square(1, 7)),

            new Piece(PieceType.PAWN, true, new Square(6, 0)), new Piece(PieceType.PAWN, true, new Square(6, 1)), new Piece(PieceType.PAWN, true, new Square(6, 2)), new Piece(PieceType.PAWN, true, new Square(6, 3)), new Piece(PieceType.PAWN, true, new Square(6, 4)), new Piece(PieceType.PAWN, true, new Square(6, 5)), new Piece(PieceType.PAWN, true, new Square(6, 6)), new Piece(PieceType.PAWN, true, new Square(6, 7)),
            new Piece(PieceType.ROOK, true, new Square(7, 0)), new Piece(PieceType.KNIGHT, true, new Square(7, 1)), new Piece(PieceType.BISHOP, true, new Square(7, 2)), new Piece(PieceType.QUEEN, true, new Square(7, 3)), new Piece(PieceType.KING, true, new Square(7, 4)), new Piece(PieceType.BISHOP, true, new Square(7, 5)), new Piece(PieceType.KNIGHT, true, new Square(7, 6)), new Piece(PieceType.ROOK, true, new Square(7, 7)),
         ],
         true, // white to move
         true, // king castling possible
         true, // queen castling possible
      )
   }

   clone(): Chess {
      const lPieces: Piece[] = []
      for (let i = 0; i < this.lPieces.length; i++) {
         lPieces.push(this.lPieces[i].clone())
      }
      return new Chess(
         lPieces,
         this.isWhitePlayer,
         this.isKingCastlingPossible,
         this.isQueenCastlingPossible
      )
   }

   pieceAt(row: u8, col: u8): Nullable<Piece> {
      // return this.rows[row][col]
      for (let i = 0; i < this.lPieces.length; i++) {
         const lPiece = this.lPieces[i]
         if (lPiece.square.rowIndex === row && lPiece.square.colIndex === col) return lPiece
      }
      return null
   }

   movePiece(from: Square, to: Square) : Chess {
      for (let i = 0; i < this.lPieces.length; i++) {
         const lPiece = this.lPieces[i]
         if (lPiece.square.rowIndex === from.rowIndex && lPiece.square.colIndex === from.colIndex) {
            lPiece.square.rowIndex = to.rowIndex
            lPiece.square.colIndex = to.colIndex
            break
         }
      }
      return this
   }

   // deletePiece(lPiece: Piece): void {
   //    const lPieces = []
   //    for (let i = 0; i < this.lPieces.length; i++) {
   //       const lp = this.lPieces[i]
   //       if (lp.square.rowIndex === lPiece.square.rowIndex && lp.square.colIndex === lPiece.square.colIndex) continue
   //       lPieces.push(lp)
   //    }
   //    this.lPieces = lPieces
   // }

   // deletePieceAt(square: Square): void {
   //    const lPieces = []
   //    for (let i = 0; i < this.lPieces.length; i++) {
   //       const lp = this.lPieces[i]
   //       if (lp.square.rowIndex === square.rowIndex && lp.square.colIndex === square.colIndex) continue
   //       lPieces.push(lp)
   //    }
   //    this.lPieces = lPieces
   // }

   isSquareEmpty(row: u8, col: u8): bool {
      for (let i = 0; i < this.lPieces.length; i++) {
         const lp = this.lPieces[i]
         if (lp.square.rowIndex === row && lp.square.colIndex === col) return false
      }
      return true
   }

   locatedPieces(isWhitePlayer: bool): Piece[] {
      const accu: Piece[] = []
      for (let i = 0; i < this.lPieces.length; i++) {
         const lp = this.lPieces[i]
         if (lp.isWhite === isWhitePlayer) accu.push(lp)
      }
      return accu
   }

   playerLocatedKing(): Piece {
      const playerPieces = this.locatedPieces(this.isWhitePlayer)
      for (let i = 0; i < playerPieces.length; i++) {
         const lpiece = playerPieces[i]
         if (lpiece.type === PieceType.KING && lpiece.isWhite === this.isWhitePlayer) return lpiece
      }
      return Piece.dummy // should never happen
   }


   // indicates if the side to move is in check
   inCheck(king: Piece): bool {
      const opponentPieces = this.locatedPieces(!this.isWhitePlayer)
      for (let i = 0; i < opponentPieces.length; i++) {
         const lpiece = opponentPieces[i]
         if (lpiece.attacks(this, king)) return true
      }
      return false
   }

   possibleMoves(): Move[] {
      const accu: Move[] = []
      const playerPieces = this.locatedPieces(this.isWhitePlayer)
      const king = this.playerLocatedKing()
      console.log(`king ${king.toString()}`)
      for (let i = 0; i < playerPieces.length; i++) {
         const locatedPiece = playerPieces.at(i)

         if (locatedPiece.isPawn()) {
            const targetRow: u8 = locatedPiece.isWhite ? locatedPiece.square.rowIndex - 1 : locatedPiece.square.rowIndex + 1
            if (targetRow >= 0 && targetRow <= 7 && this.isSquareEmpty(targetRow, locatedPiece.square.colIndex)) {
               const targetSquare = new Square(targetRow, locatedPiece.square.colIndex)
               const resultingChess = this.clone().movePiece(locatedPiece.square, targetSquare)
               const move = new Move(MoveType.MOVE, locatedPiece, targetSquare, null, resultingChess)
               if (!resultingChess.inCheck(king)) accu.push(move)
            }
            const hasNotMoved: boolean = locatedPiece.isWhite ? locatedPiece.square.rowIndex === 6 : locatedPiece.square.rowIndex === 1
            if (hasNotMoved) {
               const targetRow = locatedPiece.isWhite ? locatedPiece.square.rowIndex - 2 : locatedPiece.square.rowIndex + 2
               if (targetRow >= 0 && targetRow <= 7 && this.isSquareEmpty(targetRow, locatedPiece.square.colIndex)) {
                  const targetSquare = new Square(targetRow, locatedPiece.square.colIndex)
                  const resultingChess = this.clone().movePiece(locatedPiece.square, targetSquare)
                  const move = new Move(MoveType.MOVE, locatedPiece, targetSquare, null, resultingChess)
                  if (!resultingChess.inCheck(king)) accu.push(move)
               }
            }
         }
      }
      return accu
   }
}
