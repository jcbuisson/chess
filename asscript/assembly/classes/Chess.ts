
import { PieceType, Piece } from './Piece'
import { Pawn } from './Pawn'
import { Bishop } from './Bishop'
import { Rook } from './Rook'
import { Knight } from './Knight'
import { King } from './King'
import { Queen } from './Queen'
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
            const p = this.pieceAtSquare(new Square(row, col))
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
            new Rook(false, new Square(7, 0)), new Knight(false, new Square(7, 1)), new Bishop(false, new Square(7, 2)), new Queen(false, new Square(7, 3)), new King(false, new Square(7, 4)), new Bishop(false, new Square(7, 5)), new Knight(false, new Square(7, 6)), new Rook(false, new Square(7, 7)),
            new Pawn(false, new Square(6, 0)), new Pawn(false, new Square(6, 1)), new Pawn(false, new Square(6, 2)), new Pawn(false, new Square(6, 3)), new Pawn(false, new Square(6, 4)), new Pawn(false, new Square(6, 5)), new Pawn(false, new Square(6, 6)), new Pawn(false, new Square(6, 7)),

            new Pawn(true, new Square(1, 0)), new Pawn(true, new Square(1, 1)), new Pawn(true, new Square(1, 2)), new Pawn(true, new Square(1, 3)), new Pawn(true, new Square(1, 4)), new Pawn(true, new Square(1, 5)), new Pawn(true, new Square(1, 6)), new Pawn(true, new Square(1, 7)),
            new Rook(true, new Square(0, 0)), new Knight(true, new Square(0, 1)), new Bishop(true, new Square(0, 2)), new Queen(true, new Square(0, 3)), new King(true, new Square(0, 4)), new Bishop(true, new Square(0, 5)), new Knight(true, new Square(0, 6)), new Rook(true, new Square(0, 7)),
         ],
         true, // white to move
         true, // king castling possible
         true, // queen castling possible
      )
   }

   clone(): Chess {
      return new Chess(
         // this.pieces.map<Piece>(piece => piece.clone()),
         this.pieces.map<Piece>(piece => piece),
         this.isWhitePlayer,
         this.isKingCastlingPossible,
         this.isQueenCastlingPossible
      )
   }

   pieceAtSquare(square: Square): Nullable<Piece> {
      for (let i = 0; i < this.pieces.length; i++) {
         const piece = this.pieces[i]
         if (piece.square.rowIndex === square.rowIndex && piece.square.colIndex === square.colIndex) return piece
      }
      return null
   }

   cloneWithMovedPiece(piece: Piece, to: Square) : Chess {
      // create a new board situation
      const clonedChess = this.clone()
      // replace piece by a new one
      const movedPiece = piece.clone() // clone preserve subtype
      movedPiece.square = to
      clonedChess.deletePiece(piece)
      clonedChess.pieces.push(movedPiece)
      return clonedChess
   }

   cloneWithEatenPiece(fromPiece: Piece, toPiece: Piece) : Chess {
      // create a new board situation
      const clonedChess = this.clone()
      // replace `fromPiece` by a new one
      const movedPiece = fromPiece.clone() // clone preserve subtype
      movedPiece.square = toPiece.square
      
      clonedChess.deletePiece(fromPiece)
      clonedChess.deletePiece(toPiece)
      clonedChess.pieces.push(movedPiece)
      return clonedChess
   }

   deletePiece(piece: Piece): Chess {
      // À TESTER
      // this.pieces.slice(this.pieces.indexOf(piece), 1)
      const pieces: Piece[] = []
      for (let i = 0; i < this.pieces.length; i++) {
         const lp = this.pieces[i]
         if (lp.square.rowIndex === piece.square.rowIndex && lp.square.colIndex === piece.square.colIndex) continue
         pieces.push(lp)
      }
      this.pieces = pieces
      return this
   }

   isSquareEmpty(square: Square): bool {
      return this.pieceAtSquare(square) === null
   }

   piecesOf(isWhitePlayer: bool): Piece[] {
      const accu: Piece[] = []
      for (let i = 0; i < this.pieces.length; i++) {
         const piece = this.pieces[i]
         if (piece.isWhite === isWhitePlayer) accu.push(piece)
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
         const piece = playerPieces[i]
         if (piece.type === PieceType.KING && piece.isWhite === this.isWhitePlayer) return piece
      }
      return Piece.dummy // should never happen
   }

   // indicates if the side to move is in check
   inCheck(king: Piece): bool {
      const opponentPieces = this.piecesOf(!this.isWhitePlayer)
      for (let i = 0; i < opponentPieces.length; i++) {
         const piece = opponentPieces[i]
         if (piece.attacks(this, king)) return true
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
         const piece: Piece = playerPieces.at(i)
         const pieceMoves: Move[] = piece.possibleMoves(this, king)
         for (let i = 0; i < pieceMoves.length; i++) {
            accu.push(pieceMoves[i])
         }
      }
      return accu
   }
}
