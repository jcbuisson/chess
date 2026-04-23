
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

// alternative de représentation des pieces d'une position : chaine de 64 caractères
// rnbqkbnrpppppppp................................PPPPPPPPRNBQKBNR
// - facile de trouver les voisins (+8, +9 etc.)
// - facile de cloner
// - une case est représentée par un indice 0..63

// mieux : un tableau de 64 bits pour chaque type de piece
// des masques permettent de faire les tests rapidement


export class Chess {
   constructor(
      public pieces: Piece[],

      public isWhiteToPlay: bool,

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

   // Print in FEN notation
   // Initial position: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
   print(): string {
      let result = ''
      let spaceCount = 0
      for (let row: u8 = 7; row < 255; row--) {
         for (let col: u8 = 0; col < 8; col++) {
            const p = this.pieceAtSquare(new Square(row, col))
            if (p.isNull()) {
               spaceCount += 1
            } else {
               if (spaceCount > 0) {
                  result += `${spaceCount}`
                  spaceCount = 0
               }
               result += p.toTypeString()
            }
         }
         if (spaceCount > 0) {
            result += `${spaceCount}`
            spaceCount = 0
         }
         if (row > 0) result += '/'
      }
      return `${result} ${this.isWhiteToPlay ? 'w': 'b'} ${this.isWhiteKingCastlingPossible ? 'K': '-'}${this.isWhiteQueenCastlingPossible ? 'Q': '-'}${this.isBlackKingCastlingPossible ? 'k': '-'}${this.isBlackQueenCastlingPossible ? 'q': '-'} - 0 1`
   }

   // Parse from FEN notation
   // Initial position: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
   static parse(str: string): Chess {
      const pieces: Piece[] = []
      let rowIndex: u8 = 7
      let colIndex: u8 = 0
      let i: u8 = 0
      for (; ; i++) {
         const c = str.charAt(i);
         if (c === ' ') break

         else if (c === '/') { colIndex = 0; rowIndex -= 1 }
         else if (c === '1') colIndex += 1
         else if (c === '2') colIndex += 2
         else if (c === '3') colIndex += 3
         else if (c === '4') colIndex += 4
         else if (c === '5') colIndex += 5
         else if (c === '6') colIndex += 6
         else if (c === '7') colIndex += 7
         else if (c === '8') colIndex += 8
         else if (c === '9') colIndex += 9
         else if (c === 'r') pieces.push(new Rook(false, new Square(rowIndex, colIndex++)))
         else if (c === 'n') pieces.push(new Knight(false, new Square(rowIndex, colIndex++)))
         else if (c === 'b') pieces.push(new Bishop(false, new Square(rowIndex, colIndex++)))
         else if (c === 'q') pieces.push(new Queen(false, new Square(rowIndex, colIndex++)))
         else if (c === 'k') pieces.push(new King(false, new Square(rowIndex, colIndex++)))
         else if (c === 'p') pieces.push(new Pawn(false, new Square(rowIndex, colIndex++)))
         else if (c === 'R') pieces.push(new Rook(true, new Square(rowIndex, colIndex++)))
         else if (c === 'N') pieces.push(new Knight(true, new Square(rowIndex, colIndex++)))
         else if (c === 'B') pieces.push(new Bishop(true, new Square(rowIndex, colIndex++)))
         else if (c === 'Q') pieces.push(new Queen(true, new Square(rowIndex, colIndex++)))
         else if (c === 'K') pieces.push(new King(true, new Square(rowIndex, colIndex++)))
         else if (c === 'P') pieces.push(new Pawn(true, new Square(rowIndex, colIndex++)))
      }
      i += 1
      const isWhiteToPlay = (str.charAt(i++) === 'w')
      i += 1
      const isWhiteKingCastlingPossible = (str.charAt(i++) === 'K')
      const isWhiteQueenCastlingPossible = (str.charAt(i++) === 'Q')
      const isBlackKingCastlingPossible = (str.charAt(i++) === 'k')
      const isBlackQueenCastlingPossible = (str.charAt(i++) === 'q')
      i += 1
      const enPassant = str.charAt(i++)
      i += 1
      const halfMove = str.charAt(i++)
      i += 1
      const fullMove = str.charAt(i++)
      return new Chess(pieces, isWhiteToPlay, isWhiteKingCastlingPossible, isWhiteQueenCastlingPossible, isBlackKingCastlingPossible, isBlackQueenCastlingPossible, null)
   }

   static createInitialBoard(): Chess {
      return Chess.parse('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
      // return Chess.parse('rnb2rk1/ppppnppp/7q/3Np3/1b2P3/1P3PP1/P1PP3P/R1BQKBNR w KQ-- - 0 1')
   }

   clone(): Chess {
      return new Chess(
         this.pieces.map<Piece>(piece => piece),
         this.isWhiteToPlay,
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
      clonedChess.isWhiteToPlay = !this.isWhiteToPlay
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
      clonedChess.isWhiteToPlay = !this.isWhiteToPlay
      // replace `fromPiece` by a new one
      const movedPiece = fromPiece.clone() // clone preserve subtype
      movedPiece.square = toPiece.square
      
      clonedChess.deletePieceAt(fromPiece.square)
      clonedChess.deletePieceAt(toPiece.square)
      clonedChess.pieces.push(movedPiece)
      return clonedChess
   }

   cloneWithMovedPieceWithPromotion(piece: Piece, to: Square, promotionPieceType: PieceType) : Chess {
      // create a new board situation
      const clonedChess = this.clone()
      clonedChess.isWhiteToPlay = !this.isWhiteToPlay
      // replace piece by a new one (change class)
      const movedPiece = promotionPieceType === PieceType.QUEEN ? new Queen(piece.isWhite, to) : PieceType.ROOK ? new Rook(piece.isWhite, to) : promotionPieceType === PieceType.KNIGHT ? new Knight(piece.isWhite, to) : new Bishop(piece.isWhite, to)
      clonedChess.deletePieceAt(piece.square)
      clonedChess.pieces.push(movedPiece)
      return clonedChess
   }

   cloneWithEatenPieceWithPromotion(fromPiece: Piece, toPiece: Piece, promotionPieceType: PieceType) : Chess {
      // create a new board situation
      const clonedChess = this.clone()
      clonedChess.isWhiteToPlay = !this.isWhiteToPlay
      // replace `fromPiece` by a new one (change class)
      const movedPiece = promotionPieceType === PieceType.QUEEN ? new Queen(fromPiece.isWhite, toPiece.square) : PieceType.ROOK ? new Rook(fromPiece.isWhite, toPiece.square) : promotionPieceType === PieceType.KNIGHT ? new Knight(fromPiece.isWhite, toPiece.square) : new Bishop(fromPiece.isWhite, toPiece.square)
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

   isSquareAttackedBy(square: Square, isWhite: bool): bool {
      const opponentPieces = this.piecesOf(isWhite);
      for (let i = 0; i < opponentPieces.length; i++) {
         const piece = opponentPieces[i]
         // console.log(`isSquareAttackedBy square=${square} piece=${piece}, result=${piece.attacks(this, square)}`)
         if (piece.attacks(this, square)) return true
      }
      return false
   }

   // indicates if the side `isWhite` is in check
   inCheck(isWhite: bool): bool {
      const kingSquare = this.kingSquare(isWhite);
      return this.isSquareAttackedBy(kingSquare, !isWhite)
   }

   isCheckmate(isWhite: bool): bool {
      return this.inCheck(isWhite) && this.possibleMoves(isWhite).length === 0
   }

   // Evaluates the position from the white perspective
   // A positive score means a better position for white
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
      if (isWhite) {
         if (this.isWhiteKingCastlingPossible) {
            const sq04 = new Square(0, 4)
            const sq05 = new Square(0, 5)
            const sq06 = new Square(0, 6)
            const sq07 = new Square(0, 7)
            if (notAttacked(this, [sq04, sq05, sq06, sq07]) && empty(this, [sq05, sq06])) {
               const resultingChess = performCastling(accu, this, MoveType.KING_CASTLING, sq07, sq05, sq04, sq06)
               resultingChess.isWhiteKingCastlingPossible = false
               resultingChess.isWhiteQueenCastlingPossible = false
            }
         }
         if (this.isWhiteQueenCastlingPossible) {
            const sq00 = new Square(0, 0)
            const sq01 = new Square(0, 1)
            const sq02 = new Square(0, 2)
            const sq03 = new Square(0, 3)
            const sq04 = new Square(0, 4)
            if (notAttacked(this, [sq00, sq01, sq02, sq03, sq04]) && empty(this, [sq01, sq02, sq03])) {
               const resultingChess = performCastling(accu, this, MoveType.QUEEN_CASTLING, sq00, sq03, sq04, sq02)
               resultingChess.isWhiteQueenCastlingPossible = false
               resultingChess.isWhiteKingCastlingPossible = false
            }
         }
      } else {
         if (this.isBlackKingCastlingPossible) {
            const sq74 = new Square(7, 4)
            const sq75 = new Square(7, 5)
            const sq76 = new Square(7, 6)
            const sq77 = new Square(7, 7)
            if (notAttacked(this, [sq74, sq75, sq76, sq77]) && empty(this, [sq75, sq76])) {
               const resultingChess = performCastling(accu, this, MoveType.KING_CASTLING, sq77, sq75, sq74, sq76)
               resultingChess.isBlackKingCastlingPossible = false
               resultingChess.isBlackQueenCastlingPossible = false
            }
         }
         if (this.isBlackQueenCastlingPossible) {
            const sq70 = new Square(7, 0)
            const sq71 = new Square(7, 1)
            const sq72 = new Square(7, 2)
            const sq73 = new Square(7, 3)
            const sq74 = new Square(7, 4)
            if (notAttacked(this, [sq70, sq71, sq72, sq73, sq74]) && empty(this, [sq71, sq72, sq73])) {
               const resultingChess = performCastling(accu, this, MoveType.QUEEN_CASTLING, sq70, sq73, sq74, sq72)
               resultingChess.isBlackQueenCastlingPossible = false
               resultingChess.isBlackKingCastlingPossible = false
            }
         }
      }
      return accu
   }
}

// helper function
function notAttacked(chess: Chess, squares: Square[]): bool {
   const isWhite = chess.isWhiteToPlay
   for (let i = 0; i < squares.length; i++) {
      if (chess.isSquareAttackedBy(squares[i], !isWhite)) return false
   }
   return true
}

// helper function
function empty(chess: Chess, squares: Square[]): bool {
   for (let i = 0; i < squares.length; i++) {
      if (!chess.isSquareEmpty(squares[i])) return false
   }
   return true
}

// helper function
function performCastling(accu: Move[], chess: Chess, moveType: MoveType, rookStart: Square, rookEnd: Square, kingStart: Square, kingEnd: Square): Chess {
   const isWhite = chess.isWhiteToPlay
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
