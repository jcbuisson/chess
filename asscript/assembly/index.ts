// The entry file of your WebAssembly module.

type int = i32 // or i64
const PositiveInfinity = i32.MAX_VALUE // or i64.MAX_VALUE
const NegativeInfinity = i32.MIN_VALUE // or i64.MIN_VALUE


export function add(a: int, b: int): int {
   return a + b;
}


export function alphaBeta(
   depth: int,          // Current depth in game tree
   maxDepth: int,
   nodeIndex: int,      // Index of current node in scores array
   isMaximizingPlayer: bool, // True if maximizing player, False if minimizing player
   scores: StaticArray<int>, // Array of leaf node scores
   alpha: int,          // Alpha value
   beta: int            // Beta value
): int {
   if (depth === maxDepth) { // Assume maximum depth of 3
      return unchecked(scores[nodeIndex])
   }

   if (isMaximizingPlayer) {
      let maxEval: int = NegativeInfinity
      for (let i = 0; i < 2; i++) { // Assume binary tree
         const value: int = alphaBeta(depth + 1, maxDepth, nodeIndex * 2 + i, false, scores, alpha, beta);
         maxEval = max(maxEval, value)
         alpha = max(alpha, value)
         if (beta <= alpha) {
            break
         }
      }
      return maxEval
   } else {
      let minEval: int = PositiveInfinity
      for (let i = 0; i < 2; i++) {
         const value: int = alphaBeta(depth + 1, maxDepth, nodeIndex * 2 + i, true, scores, alpha, beta)
         minEval = min(minEval, value)
         beta = min(beta, value)
         if (beta <= alpha) {
            break
         }
      }
      return minEval
   }
}

export function testAB():int {
   const scores = new StaticArray<int>(8)
   scores[0] = 3
   scores[1] = 5
   scores[2] = 6
   scores[3] = 9
   scores[4] = 1
   scores[5] = 2
   scores[6] = 0
   scores[7] = -1

   const MAXDEPTH = 3
   const result = alphaBeta(0, MAXDEPTH, 0, true, scores, NegativeInfinity, PositiveInfinity)
   return result
}

export function isPrime(n: i32): boolean {
   for (let i = 2; i < n; i++) {
      if (n % i === 0) {
         return false
      }
   }
   return true
}

export function getPrime(n: i32): i32 {
   let count = 0
   let num = 2
   while (n > count) {
      if (isPrime(num)) {
         count += 1
      }
      num += 1
   }
   return num - 1
}



type Nullable<T> = T | null


class Piece {
   constructor(
      public type: u8,
      public isWhite: boolean,
   ) {
   }

   static readonly PAWN: u8 = 0
   static readonly ROOK: u8 = 1
   static readonly KNIGHT: u8 = 2
   static readonly BISHOP: u8 = 3
   static readonly QUEEN: u8 = 4
   static readonly KING: u8 = 5

   isPawn(): boolean {
      return this.type === Piece.PAWN
   }

   isKnight(): boolean {
      return this.type === Piece.KNIGHT
   }

   isBishop(): boolean {
      return this.type === Piece.BISHOP
   }

   isRook(): boolean {
      return this.type === Piece.ROOK
   }

   toString(): string {
      // return ".pnbrqkPNBRQK".charAt(this.type)
      let s = "pnbrqk".charAt(this.type)
      return this.isWhite ? s.toUpperCase() : s
   }
}


class Square {
   constructor(
      public rowIndex: u8,  // ex: 0=8,.. , 7=1
      public colIndex: u8,  // ex: 0=a,.. , 7=h
   ) {
   }

   toString(): string {
      return "abcdefgh".charAt(this.colIndex) + "87654321".charAt(this.rowIndex)
   }
}

class LocatedPiece {
   constructor(
      public piece: Piece,
      public square: Square,
   ) {
   }

   toString(): string {
      return this.piece.toString() + this.square.toString()
   }
}

class Move {
   constructor(
      public piece: Piece,
      public from: Square,
      public to: Square,
      public promotion: Piece | null,
   ) {
   }

   toString(): string {
      return "todo"
   }
}

function row2ascii(row: Array<Nullable<Piece>>): string {
   return row.reduce((accu, piece) => `${accu} ${piece ? piece.toString(): '.'} `, '')
}

class Chess {
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
      const lpieces = this.locatedPieces()
      for (let i = 0; i < lpieces.length; i++) {
         const locatedPiece = lpieces.at(i)
         
      }
      return []
   }
}

function createInitialBoard(): Chess {
   return new Chess(
      [
         [new Piece(Piece.ROOK, false),  new Piece(Piece.KNIGHT, false),  new Piece(Piece.BISHOP, false),  new Piece(Piece.QUEEN, false),  new Piece(Piece.KING, false),  new Piece(Piece.BISHOP, false),  new Piece(Piece.KNIGHT, false),  new Piece(Piece.ROOK, false)],
         [new Piece(Piece.PAWN, false),  new Piece(Piece.PAWN, false),    new Piece(Piece.PAWN, false),    new Piece(Piece.PAWN, false),   new Piece(Piece.PAWN, false),  new Piece(Piece.PAWN, false),    new Piece(Piece.PAWN, false),    new Piece(Piece.PAWN, false)],
         [null,    null,    null,    null,    null,    null,    null,    null],
         [null,    null,    null,    null,    null,    null,    null,    null],
         [null,    null,    null,    null,    null,    null,    null,    null],
         [null,    null,    null,    null,    null,    null,    null,    null],
         [new Piece(Piece.PAWN, true),   new Piece(Piece.PAWN, true),     new Piece(Piece.PAWN, true),     new Piece(Piece.PAWN, true),    new Piece(Piece.PAWN, true),   new Piece(Piece.PAWN, true),     new Piece(Piece.PAWN, true),     new Piece(Piece.PAWN, true)],
         [new Piece(Piece.ROOK, true),   new Piece(Piece.KNIGHT, true),   new Piece(Piece.BISHOP, true),   new Piece(Piece.QUEEN, true),   new Piece(Piece.KING, false),  new Piece(Piece.BISHOP, true),   new Piece(Piece.KNIGHT, true),   new Piece(Piece.ROOK, true)],
      ],
      true, // white to move
      true, // king castling possible
      true, // queen castling possible
   )
}

// global state
const currentChess: Chess = createInitialBoard()

export function testChessToAscii(): string {
   return currentChess.toAscii()
}

export function testLocatedPieces(): string {
   const lpieces: LocatedPiece[] = currentChess.locatedPieces()
   return lpieces.reduce((accu, lpiece) => `${accu}, ${lpiece.toString()}`, '')
}
