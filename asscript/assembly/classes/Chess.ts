
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

// alternative de représentation des pieces d'une position 
// rnbqkbnrpppppppp........................PPPPPPPPRNBQKBNR
// - facile de trouver les voisins (+8, +9 etc.)
// - facile de cloner
// - une case est représentée par un indice 0..63


export class Chess {
   constructor(
      public pieces: Piece[],
      public isWhiteKingCastlingPossible: boolean,
      public isWhiteQueenCastlingPossible: boolean,
      public isBlackKingCastlingPossible: boolean,
      public isBlackQueenCastlingPossible: boolean,

      // helpers
      public bestMove: Nullable<Move>,

      // cached:
      // kingSquare, inCheck
   ) {
   }

   toAscii(): string {
      let result = '  +------------------------+\n'
      for (let row: u8 = 7; row < 255; row--) {
         let line = ''
         for (let col: u8 = 0; col < 8; col++) {
            const p = this.pieceAtSquare(new Square(row, col))
            const x = p.isNull() ? '.' : p.toTypeString()
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
         true, // white king castling possible
         true, // white queen castling possible
         true, // black king castling possible
         true, // black queen castling possible
         null,
      )
   }

   clone(): Chess {
      return new Chess(
         this.pieces.map<Piece>(piece => piece),
         this.isWhiteKingCastlingPossible,
         this.isWhiteQueenCastlingPossible,
         this.isBlackKingCastlingPossible,
         this.isBlackQueenCastlingPossible,
         null,
      )
   }

   // pieceAtSquare(square: Square): Nullable<Piece> {
   pieceAtSquare(square: Square): Piece {
      for (let i = 0; i < this.pieces.length; i++) {
         const piece = this.pieces[i]
         if (piece.square.rowIndex === square.rowIndex && piece.square.colIndex === square.colIndex) return piece
      }
      // return null
      return Piece.dummy
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
      return this.pieceAtSquare(square).isNull()
   }

   piecesOf(isWhite: bool): Piece[] {
      const accu: Piece[] = []
      for (let i = 0; i < this.pieces.length; i++) {
         const piece = this.pieces[i]
         if (piece.isWhite === isWhite) accu.push(piece)
      }
      return accu
   }

   kingSquare(isWhite: bool): Square {
      const playerPieces = this.piecesOf(isWhite)
      for (let i = 0; i < playerPieces.length; i++) {
         const piece = playerPieces[i]
         if (piece.type === PieceType.KING && piece.isWhite === isWhite) return piece.square
      }
      return Square.dummy // should never happen
   }

   isSquareAttacked(isWhite: bool, square: Square): bool {
      const opponentPieces = this.piecesOf(!isWhite);
      for (let i = 0; i < opponentPieces.length; i++) {
         const piece = opponentPieces[i]
         if (piece.attacks(this, square)) return true
      }
      return false
   }

   // indicates if the side `isWhite` is in check
   inCheck(isWhite: bool): bool {
      const kingSquare = this.kingSquare(isWhite);
      return this.isSquareAttacked(isWhite, kingSquare)
   }

   isCheckmate(isWhite: bool): bool {
      return this.inCheck(isWhite) && this.possibleMoves(isWhite).length === 0
   }

   evaluate(): number {
      let whitePieces = 0
      let blackPieces = 0
      for (let i = 0; i < this.pieces.length; i++) {
         const piece = this.pieces[i]
         if (piece.type === PieceType.QUEEN) {
            if (piece.isWhite) { whitePieces += 9 } else { blackPieces += 9 }
         }
         if (piece.type === PieceType.ROOK) {
            if (piece.isWhite) { whitePieces += 5 } else { blackPieces += 5 }
         }
         if (piece.type === PieceType.BISHOP || piece.type === PieceType.KNIGHT) {
            if (piece.isWhite) { whitePieces += 3 } else { blackPieces += 3 }
         }
         if (piece.type === PieceType.PAWN) {
            if (piece.isWhite) { whitePieces += 1 } else { blackPieces += 1 }
         }
      }
      // console.log(`${whitePieces}, ${blackPieces}, ${this.possibleMoves(true).length}, ${this.possibleMoves(false).length}`)
      return 100*whitePieces + this.possibleMoves(true).length - 100*blackPieces - this.possibleMoves(false).length
   }

   possibleMoves(isWhite: bool): Move[] {
      const accu: Move[] = []
      // PIECES MOVES
      const playerPieces = this.piecesOf(isWhite)
      for (let i = 0; i < playerPieces.length; i++) {
         const piece: Piece = playerPieces.at(i)
         const pieceMoves: Move[] = piece.possibleMoves(this)
         for (let i = 0; i < pieceMoves.length; i++) {
            accu.push(pieceMoves[i])
         }
      }
      // CASTLING MOVES
      function notAttacked(chess: Chess, isWhite: bool, squares: Square[]): bool {
         for (let i = 0; i < squares.length; i++) {
            if (chess.isSquareAttacked(isWhite, squares[i])) return false
         }
         return true
      }

      function empty(chess: Chess, squares: Square[]): bool {
         for (let i = 0; i < squares.length; i++) {
            if (!chess.isSquareEmpty(squares[i])) return false
         }
         return true
      }

      function performCastling(accu: Move[], chess: Chess, isWhite: bool, moveType: MoveType, rookStart: Square, rookEnd: Square, kingStart: Square, kingEnd: Square): Chess {
         const resultingChess = chess.clone()
         resultingChess.deletePieceAt(kingStart)
         resultingChess.deletePieceAt(rookStart)
         const movedKing = new King(isWhite, kingEnd)
         resultingChess.pieces.push(movedKing)
         const rook = chess.pieceAtSquare(rookStart) // sure to be not null
         const movedRook = rook.clone()
         movedRook.square = rookEnd
         resultingChess.pieces.push(movedRook)
         const move = new Move(moveType, movedKing, Square.dummy, PieceType.NONE, resultingChess)
         accu.push(move)
         return resultingChess
      }

      if (isWhite) {
         if (this.isWhiteKingCastlingPossible) {
            const sq04 = new Square(0, 4)
            const sq05 = new Square(0, 5)
            const sq06 = new Square(0, 6)
            const sq07 = new Square(0, 7)
            if (notAttacked(this, isWhite, [sq04, sq05, sq06, sq07]) && empty(this, [sq05, sq06])) {
               const resultingChess = performCastling(accu, this, isWhite, MoveType.KING_CASTLING, sq07, sq05, sq04, sq06)
               resultingChess.isWhiteKingCastlingPossible = false
            }
         }
         if (this.isWhiteQueenCastlingPossible) {
            const sq00 = new Square(0, 0)
            const sq01 = new Square(0, 1)
            const sq02 = new Square(0, 2)
            const sq03 = new Square(0, 3)
            const sq04 = new Square(0, 4)
            if (notAttacked(this, isWhite, [sq00, sq01, sq02, sq03, sq04]) && empty(this, [sq01, sq02, sq03])) {
               const resultingChess = performCastling(accu, this, isWhite, MoveType.QUEEN_CASTLING, sq00, sq03, sq04, sq02)
               resultingChess.isWhiteQueenCastlingPossible = false
            }
         }
      } else {
         if (this.isBlackKingCastlingPossible) {
            const sq74 = new Square(7, 4)
            const sq75 = new Square(7, 5)
            const sq76 = new Square(7, 6)
            const sq77 = new Square(7, 7)
            if (notAttacked(this, isWhite, [sq74, sq75, sq76, sq77]) && empty(this, [sq75, sq76])) {
               const resultingChess = performCastling(accu, this, isWhite, MoveType.KING_CASTLING, sq77, sq75, sq74, sq76)
               resultingChess.isBlackKingCastlingPossible = false
            }
         }
         if (this.isBlackQueenCastlingPossible) {
            const sq70 = new Square(7, 0)
            const sq71 = new Square(7, 1)
            const sq72 = new Square(7, 2)
            const sq73 = new Square(7, 3)
            const sq74 = new Square(7, 4)
            if (notAttacked(this, isWhite, [sq70, sq71, sq72, sq73, sq74]) && empty(this, [sq71, sq72, sq73])) {
               const resultingChess = performCastling(accu, this, isWhite, MoveType.QUEEN_CASTLING, sq70, sq73, sq74, sq72)
               resultingChess.isBlackQueenCastlingPossible = false
            }
         }
      }
      return accu
   }
}
