
// import { PieceType, Piece } from './Piece'
import { PieceType, LPiece } from './LPiece'
import { LBishop } from './LBishop'
import { Square } from './Square'
// import { LocatedPiece } from './LocatedPiece'
// import { LocatedBishop } from './LocatedBishop'
import { MoveType, Move } from './Move'

type Nullable<T> = T | null


// rnbkqbnrpppppppp..............................PPPPPPPPRNBQKBNR
// r00n01b02k03
// liste de LocatedPiece
export class Chess {
   constructor(
      // public rows: Nullable<Piece>[][],
      public lPieces: LPiece[],
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
            new LPiece(PieceType.ROOK, false, new Square(0, 0)), new LPiece(PieceType.KNIGHT, false, new Square(0, 1)), new LPiece(PieceType.BISHOP, false, new Square(0, 2)),  new LPiece(PieceType.QUEEN, false, new Square(0, 3)), new LPiece(PieceType.KING, false, new Square(0, 4)), new LBishop(false, new Square(4, 7)), new LPiece(PieceType.KNIGHT, false, new Square(0, 6)), new LPiece(PieceType.ROOK, false, new Square(0, 7)),
            new LPiece(PieceType.PAWN, false, new Square(1, 0)), new LPiece(PieceType.PAWN, false, new Square(1, 1)), new LPiece(PieceType.PAWN, false, new Square(1, 2)), new LPiece(PieceType.PAWN, false, new Square(1, 3)), new LPiece(PieceType.PAWN, false, new Square(1, 4)), new LPiece(PieceType.PAWN, false, new Square(1, 5)), new LPiece(PieceType.PAWN, false, new Square(1, 6)), new LPiece(PieceType.PAWN, false, new Square(1, 7)),

            new LPiece(PieceType.PAWN, true, new Square(6, 0)), new LPiece(PieceType.PAWN, true, new Square(6, 1)), new LPiece(PieceType.PAWN, true, new Square(6, 2)), new LPiece(PieceType.PAWN, true, new Square(6, 3)), new LPiece(PieceType.PAWN, true, new Square(6, 4)), new LPiece(PieceType.PAWN, true, new Square(6, 5)), new LPiece(PieceType.PAWN, true, new Square(6, 6)), new LPiece(PieceType.PAWN, true, new Square(6, 7)),
            new LPiece(PieceType.ROOK, true, new Square(7, 0)), new LPiece(PieceType.KNIGHT, true, new Square(7, 1)), new LPiece(PieceType.BISHOP, true, new Square(7, 2)), new LPiece(PieceType.QUEEN, true, new Square(7, 3)), new LPiece(PieceType.KING, true, new Square(7, 4)), new LPiece(PieceType.BISHOP, true, new Square(7, 5)), new LPiece(PieceType.KNIGHT, true, new Square(7, 6)), new LPiece(PieceType.ROOK, true, new Square(7, 7)),
         ],
         true, // white to move
         true, // king castling possible
         true, // queen castling possible
      )
   }

   clone(): Chess {
      const lPieces: LPiece[] = []
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

   pieceAt(row: u8, col: u8): Nullable<LPiece> {
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

   deletePiece(lPiece: LPiece): void {
      const lPieces = []
      for (let i = 0; i < this.lPieces.length; i++) {
         const lp = this.lPieces[i]
         if (lp.square.rowIndex === lPiece.square.rowIndex && lp.square.colIndex === lPiece.square.colIndex) continue
         lPieces.push(lp)
      }
      this.lPieces = lPieces
   }

   deletePieceAt(square: Square): void {
      const lPieces = []
      for (let i = 0; i < this.lPieces.length; i++) {
         const lp = this.lPieces[i]
         if (lp.square.rowIndex === square.rowIndex && lp.square.colIndex === square.colIndex) continue
         lPieces.push(lp)
      }
      this.lPieces = lPieces
   }

   isSquareEmpty(row: u8, col: u8): bool {
      for (let i = 0; i < this.lPieces.length; i++) {
         const lp = this.lPieces[i]
         if (lp.square.rowIndex === row && lp.square.colIndex === col) return false
      }
      return true
   }

   locatedPieces(isWhitePlayer: bool): LPiece[] {
      const accu: LPiece[] = []
      for (let i = 0; i < this.lPieces.length; i++) {
         const lp = this.lPieces[i]
         if (lp.isWhite === isWhitePlayer) accu.push(lp)
      }
      return accu
   }

   playerLocatedKing(): LPiece {
      const playerLPieces = this.locatedPieces(this.isWhitePlayer)
      for (let i = 0; i < playerLPieces.length; i++) {
         const lpiece = playerLPieces[i]
         if (lpiece.type === PieceType.KING && lpiece.isWhite === this.isWhitePlayer) return lpiece
      }
      return LPiece.dummy // should never happen
   }


   // indicates if the side to move is in check
   inCheck(king: LPiece): bool {
      const opponentLPieces = this.locatedPieces(!this.isWhitePlayer)
      for (let i = 0; i < opponentLPieces.length; i++) {
         const lpiece = opponentLPieces[i]
         if (lpiece.attacks(this, king)) return true
      }
      return false
   }

   possibleMoves(): Move[] {
      const accu: Move[] = []
      const playerLPieces = this.locatedPieces(this.isWhitePlayer)
      const king = this.playerLocatedKing()
      console.log(`king ${king.toString()}`)
      for (let i = 0; i < playerLPieces.length; i++) {
         const locatedPiece = playerLPieces.at(i)

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
