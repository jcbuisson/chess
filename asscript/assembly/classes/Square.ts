
export class Square {
   constructor(
      public rowIndex: u8,  // ex: 0=8,.. , 7=1
      public colIndex: u8,  // ex: 0=a,.. , 7=h
   ) {
   }

   toString(): string {
      return "abcdefgh".charAt(this.colIndex) + "87654321".charAt(this.rowIndex)
   }
}
