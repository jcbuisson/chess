
import { PieceType, Piece } from './Piece'
import { Pawn } from './Pawn'
import { Bishop } from './Bishop'
import { Rook } from './Rook'
import { Knight } from './Knight'
import { King } from './King'
import { Queen } from './Queen'
import { Square } from './Square'
import { Move, MoveType } from './Move'

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
      public isWhiteKingCastlingPossible: boolean,
      public isWhiteQueenCastlingPossible: boolean,
      public isBlackKingCastlingPossible: boolean,
      public isBlackQueenCastlingPossible: boolean,
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
         true, // white king castling possible
         true, // white queen castling possible
         true, // black king castling possible
         true, // black queen castling possible
      )
   }

   clone(): Chess {
      return new Chess(
         // this.pieces.map<Piece>(piece => piece.clone()),
         this.pieces.map<Piece>(piece => piece),
         this.isWhitePlayer,
         this.isWhiteKingCastlingPossible,
         this.isWhiteQueenCastlingPossible,
         this.isBlackKingCastlingPossible,
         this.isBlackQueenCastlingPossible,
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
      clonedChess.deletePieceAt(piece.square)
      clonedChess.pieces.push(movedPiece)
      return clonedChess
   }

   cloneWithEatenPiece(fromPiece: Piece, toPiece: Piece) : Chess {
      // create a new board situation
      const clonedChess = this.clone()
      // replace `fromPiece` by a new one
      const movedPiece = fromPiece.clone() // clone preserve subtype
      movedPiece.square = toPiece.square
      
      clonedChess.deletePieceAt(fromPiece.square)
      clonedChess.deletePieceAt(toPiece.square)
      clonedChess.pieces.push(movedPiece)
      return clonedChess
   }

   deletePieceAt(square: Square): void {
      const pieces: Piece[] = []
      for (let i = 0; i < this.pieces.length; i++) {
         const lp = this.pieces[i]
         if (lp.square.rowIndex === square.rowIndex && lp.square.colIndex === square.colIndex) continue
         pieces.push(lp)
      }
      this.pieces = pieces
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

   playerKingSquare(): Square {
      const playerPieces = this.piecesOf(this.isWhitePlayer)
      for (let i = 0; i < playerPieces.length; i++) {
         const piece = playerPieces[i]
         if (piece.type === PieceType.KING && piece.isWhite === this.isWhitePlayer) return piece.square
      }
      return Square.dummy // should never happen
   }

   // indicates if the side to move is in check
   inCheck(kingSquare: Square): bool {
      const opponentPieces = this.piecesOf(!this.isWhitePlayer)
      for (let i = 0; i < opponentPieces.length; i++) {
         const piece = opponentPieces[i]
         if (piece.attacks(this, kingSquare)) return true
      }
      return false
   }

   isSquareAttacked(square: Square): bool {
      return false
   }

   possibleMoves(): Move[] {
      const accu: Move[] = []
      const playerPieces = this.piecesOf(this.isWhitePlayer)
      const kingSquare = this.playerKingSquare()
      for (let i = 0; i < playerPieces.length; i++) {
         const piece: Piece = playerPieces.at(i)
         const pieceMoves: Move[] = piece.possibleMoves(this, kingSquare)
         for (let i = 0; i < pieceMoves.length; i++) {
            accu.push(pieceMoves[i])
         }
      }

      // CASTLINGS
      if (this.isWhitePlayer) {
         if (this.isWhiteKingCastlingPossible) {
            const sq0 = new Square(0, 4)
            const sq1 = new Square(0, 5)
            const sq2 = new Square(0, 6)
            const sq3 = new Square(0, 7)
            if (this.isSquareEmpty(sq1) && this.isSquareEmpty(sq2)) {
               if (!this.isSquareAttacked(sq0) && !this.isSquareAttacked(sq1) && !this.isSquareAttacked(sq2) && !this.isSquareAttacked(sq3)) {
                  const rook = this.pieceAtSquare(sq3)
                  if (rook) {// useless
                     const resultingChess = this.clone()
                     resultingChess.deletePieceAt(kingSquare)
                     resultingChess.deletePieceAt(rook.square)
                     const movedKing = new King(this.isWhitePlayer, sq2)
                     resultingChess.pieces.push(movedKing)
                     const movedRook = rook.clone()
                     movedRook.square = sq1
                     resultingChess.pieces.push(movedRook)
                     resultingChess.isWhiteKingCastlingPossible = false
                     resultingChess.isWhiteQueenCastlingPossible = false
                     const move = new Move(MoveType.KING_CASTLING, movedKing, sq2, null, resultingChess)
                     accu.push(move)
                  }
               }
            }
         } else if (this.isWhiteQueenCastlingPossible) {
            const sq0 = new Square(0, 0)
            const sq1 = new Square(0, 1)
            const sq2 = new Square(0, 2)
            const sq3 = new Square(0, 3)
            const sq4 = new Square(0, 4)
            if (this.isSquareEmpty(sq1) && this.isSquareEmpty(sq2) && this.isSquareEmpty(sq3)) {
               if (!this.isSquareAttacked(sq0) && !this.isSquareAttacked(sq1) && !this.isSquareAttacked(sq2) && !this.isSquareAttacked(sq3) && !this.isSquareAttacked(sq4)) {
                  const rook = this.pieceAtSquare(sq0)
                  if (rook) {// useless
                     const resultingChess = this.clone()
                     resultingChess.deletePieceAt(kingSquare)
                     resultingChess.deletePieceAt(rook.square)
                     const movedKing = new King(this.isWhitePlayer, sq2)
                     resultingChess.pieces.push(movedKing)
                     const movedRook = rook.clone()
                     movedRook.square = sq3
                     resultingChess.pieces.push(movedRook)
                     resultingChess.isWhiteKingCastlingPossible = false
                     resultingChess.isWhiteQueenCastlingPossible = false
                     const move = new Move(MoveType.KING_CASTLING, movedKing, sq2, null, resultingChess)
                     accu.push(move)
                  }
               }
            }
         }
      } else {
         // black is playing
         if (this.isBlackKingCastlingPossible) {
            const sq0 = new Square(7, 4)
            const sq1 = new Square(7, 5)
            const sq2 = new Square(7, 6)
            const sq3 = new Square(7, 7)
            if (this.isSquareEmpty(sq1) && this.isSquareEmpty(sq2)) {
               if (!this.isSquareAttacked(sq0) && !this.isSquareAttacked(sq1) && !this.isSquareAttacked(sq2) && !this.isSquareAttacked(sq3)) {
                  const rook = this.pieceAtSquare(sq3)
                  if (rook) {// useless
                     const resultingChess = this.clone()
                     resultingChess.deletePieceAt(kingSquare)
                     resultingChess.deletePieceAt(rook.square)
                     const movedKing = new King(this.isWhitePlayer, sq2)
                     resultingChess.pieces.push(movedKing)
                     const movedRook = rook.clone()
                     movedRook.square = sq1
                     resultingChess.pieces.push(movedRook)
                     resultingChess.isBlackKingCastlingPossible = false
                     resultingChess.isBlackQueenCastlingPossible = false
                     const move = new Move(MoveType.KING_CASTLING, movedKing, sq2, null, resultingChess)
                     accu.push(move)
                  }
               }
            }
         } else if (this.isBlackQueenCastlingPossible) {
            const sq0 = new Square(7, 0)
            const sq1 = new Square(7, 1)
            const sq2 = new Square(7, 2)
            const sq3 = new Square(7, 3)
            const sq4 = new Square(7, 4)
            if (this.isSquareEmpty(sq1) && this.isSquareEmpty(sq2) && this.isSquareEmpty(sq3)) {
               if (!this.isSquareAttacked(sq0) && !this.isSquareAttacked(sq1) && !this.isSquareAttacked(sq2) && !this.isSquareAttacked(sq3) && !this.isSquareAttacked(sq4)) {
                  const rook = this.pieceAtSquare(sq0)
                  if (rook) {// useless
                     const resultingChess = this.clone()
                     resultingChess.deletePieceAt(kingSquare)
                     resultingChess.deletePieceAt(rook.square)
                     const movedKing = new King(this.isWhitePlayer, sq2)
                     resultingChess.pieces.push(movedKing)
                     const movedRook = rook.clone()
                     movedRook.square = sq3
                     resultingChess.pieces.push(movedRook)
                     resultingChess.isBlackKingCastlingPossible = false
                     resultingChess.isBlackQueenCastlingPossible = false
                     const move = new Move(MoveType.KING_CASTLING, movedKing, sq2, null, resultingChess)
                     accu.push(move)
                  }
               }
            }
         }
      }
      return accu
   }
}
