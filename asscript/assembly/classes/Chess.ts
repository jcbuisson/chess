
import { PieceType, Piece } from './Piece'
import { Pawn } from './Pawn'
import { Bishop } from './Bishop'
import { Square } from './Square'
import { Move } from './Move'

type Nullable<T> = T | null

// rnbqkbnrpppppppp........................PPPPPPPPRNBQKBNR
// - facile de trouver les voisins (+8, +9 etc.)
// - facile de cloner
// - une case est représentée par un indice dans la chaine 0..63


export class Chess {
   constructor(
      // public pieces: string,
      public pieces: Piece[],
      public isWhitePlayer: boolean,
      public isKingCastlingPossible: boolean,
      public isQueenCastlingPossible: boolean,
   ) {
   }

   toAscii(): string {
      let whitePieces = ''
      let blackPieces = ''
      for (let i = 0; i < this.pieces.length; i++) {
         const piece = this.pieces[i]
         if (piece.isWhite) {
            whitePieces += piece.toTypeString()
         } else {
            blackPieces += piece.toTypeString()
         }
      }
      let result = `W: ${whitePieces}, B: ${blackPieces}\n`
      result += '  +------------------------+\n'
      for (let row: u8 = 7; row < 255; row--) {
         let line = ''
         for (let col: u8 = 0; col < 8; col++) {
            const p = this.pieceAt(row, col)
            const x = p === null ? '.' : p.toTypeString()
            line += ` ${x} `
         }
         result += `${row+1} |${line}|\n`
      }
      result += '  +------------------------+\n'
      result +=  '    a  b  c  d  e  f  g  h\n'
      return result
   }

   static createInitialBoard(): Chess {
      return new Chess(
         [
            new Piece(PieceType.ROOK, false, new Square(7, 0)), new Piece(PieceType.KNIGHT, false, new Square(7, 1)), new Piece(PieceType.BISHOP, false, new Square(7, 2)),  new Piece(PieceType.QUEEN, false, new Square(7, 3)), new Piece(PieceType.KING, false, new Square(7, 4)), new Bishop(false, new Square(7, 5)), new Piece(PieceType.KNIGHT, false, new Square(7, 6)), new Piece(PieceType.ROOK, false, new Square(7, 7)),
            new Pawn(false, new Square(6, 0)), new Pawn(false, new Square(6, 1)), new Pawn(false, new Square(6, 2)), new Pawn(false, new Square(6, 3)), new Pawn(false, new Square(6, 4)), new Pawn(false, new Square(6, 5)), new Pawn(false, new Square(6, 6)), new Pawn(false, new Square(6, 7)),

            new Pawn(true, new Square(1, 0)), new Pawn(true, new Square(1, 1)), new Pawn(true, new Square(1, 2)), new Pawn(true, new Square(1, 3)), new Pawn(true, new Square(1, 4)), new Pawn(true, new Square(1, 5)), new Pawn(true, new Square(1, 6)), new Pawn(true, new Square(1, 7)),
            new Piece(PieceType.ROOK, true, new Square(0, 0)), new Piece(PieceType.KNIGHT, true, new Square(0, 1)), new Piece(PieceType.BISHOP, true, new Square(0, 2)), new Piece(PieceType.QUEEN, true, new Square(0, 3)), new Piece(PieceType.KING, true, new Square(0, 4)), new Piece(PieceType.BISHOP, true, new Square(0, 5)), new Piece(PieceType.KNIGHT, true, new Square(0, 6)), new Piece(PieceType.ROOK, true, new Square(0, 7)),
         ],
         true, // white to move
         true, // king castling possible
         true, // queen castling possible
      )
   }

   clone(): Chess {
      const pieces: Piece[] = []
      for (let i = 0; i < this.pieces.length; i++) {
         pieces.push(this.pieces[i].clone())
      }
      return new Chess(
         pieces,
         this.isWhitePlayer,
         this.isKingCastlingPossible,
         this.isQueenCastlingPossible
      )
   }

   pieceAt(row: u8, col: u8): Nullable<Piece> {
      for (let i = 0; i < this.pieces.length; i++) {
         const piece = this.pieces[i]
         if (piece.square.rowIndex === row && piece.square.colIndex === col) return piece
      }
      return null
   }

   pieceAt2(square: Square): Nullable<Piece> {
      for (let i = 0; i < this.pieces.length; i++) {
         const piece = this.pieces[i]
         if (piece.square.rowIndex === square.rowIndex && piece.square.colIndex === square.colIndex) return piece
      }
      return null
   }

   movePiece(from: Square, to: Square) : Chess {
      for (let i = 0; i < this.pieces.length; i++) {
         const piece = this.pieces[i]
         if (piece.square.rowIndex === from.rowIndex && piece.square.colIndex === from.colIndex) {
            piece.square.rowIndex = to.rowIndex
            piece.square.colIndex = to.colIndex
            break
         }
      }
      return this
   }

   eatPiece(from: Piece, to: Piece) : Chess {
      from.square = to.square.clone()
      this.pieces.slice(this.pieces.indexOf(to), 1)
      return this
   }

   deletePiece(piece: Piece): Chess {
      // this.pieces.slice(this.pieces.indexOf(piece), 1)  // À TESTER
      const pieces: Piece[] = []
      for (let i = 0; i < this.pieces.length; i++) {
         const lp = this.pieces[i]
         if (lp.square.rowIndex === piece.square.rowIndex && lp.square.colIndex === piece.square.colIndex) continue
         pieces.push(lp)
      }
      this.pieces = pieces
      return this
   }

   // deletePieceAt(square: Square): void {
   //    const pieces = []
   //    for (let i = 0; i < this.pieces.length; i++) {
   //       const lp = this.pieces[i]
   //       if (lp.square.rowIndex === square.rowIndex && lp.square.colIndex === square.colIndex) continue
   //       pieces.push(lp)
   //    }
   //    this.pieces = pieces
   // }

   isRowColEmpty(row: u8, col: u8): bool {
      return this.pieceAt(row, col) === null
   }

   isSquareEmpty(square: Square): bool {
      return this.pieceAt(square.rowIndex, square.colIndex) === null
   }

   piecesOf(isWhitePlayer: bool): Piece[] {
      const accu: Piece[] = []
      for (let i = 0; i < this.pieces.length; i++) {
         const lp = this.pieces[i]
         if (lp.isWhite === isWhitePlayer) accu.push(lp)
      }
      return accu
   }

   togglePlayer(): bool {
      this.isWhitePlayer = !this.isWhitePlayer
      return this.isWhitePlayer
   }

   playerKing(): Piece {
      const playerPieces = this.piecesOf(this.isWhitePlayer)
      for (let i = 0; i < playerPieces.length; i++) {
         const lpiece = playerPieces[i]
         if (lpiece.type === PieceType.KING && lpiece.isWhite === this.isWhitePlayer) return lpiece
      }
      return Piece.dummy // should never happen
   }

   // indicates if the side to move is in check
   inCheck(king: Piece): bool {
      const opponentPieces = this.piecesOf(!this.isWhitePlayer)
      for (let i = 0; i < opponentPieces.length; i++) {
         const lpiece = opponentPieces[i]
         if (lpiece.attacks(this, king)) return true
      }
      return false
   }

   possibleMoves(): Move[] {
      const accu: Move[] = []
      const playerPieces = this.piecesOf(this.isWhitePlayer)
      // console.log(`playerPieces ${playerPieces}`)
      const king = this.playerKing()
      // console.log(`king ${king.toString()}`)
      for (let i = 0; i < playerPieces.length; i++) {
         const piece = playerPieces.at(i)
         const pieceMoves = piece.possibleMoves(this, king)
         for (let i = 0; i < pieceMoves.length; i++) {
            accu.push(pieceMoves[i])
         }
      }
      return accu
   }
}
