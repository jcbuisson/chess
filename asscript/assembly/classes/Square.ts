

// square as u16 : row*8+col
// less objects created
// easy to do move computation


export class Square {
   constructor(
      public rowIndex: u8,  // ex: 0=1,.. , 7=8
      public colIndex: u8,  // ex: 0=a,.. , 7=h
   ) {
   }

   clone(): Square {
      return new Square(this.rowIndex, this.colIndex)
   }

   static dummy: Square = new Square(99, 99)

   move(rowIncr: i8, colIncr: i8): Square {
      return new Square(this.rowIndex + rowIncr, this.colIndex + colIncr)
   }

   static pawnRow(isWhite: bool): u8 {
      return isWhite ? 1 : 6
   }

   isValid(): bool {
      if (this.rowIndex < 0 || this.rowIndex > 7) return false
      if (this.colIndex < 0 || this.colIndex > 7) return false
      return true
   }

   toString(): string {
      // return "abcdefgh".charAt(this.colIndex) + "87654321".charAt(this.rowIndex)
      return "abcdefgh".charAt(this.colIndex) + "12345678".charAt(this.rowIndex)
   }
}
