import assert from "assert";
import { add, testAB, getPrime, testChessToAscii, testLocatedPieces } from "../build/debug.js";

assert.strictEqual(add(1, 2), 3);
console.log("ok");


const result = testAB()
console.log(`result: ${result}`);


const x = getPrime(10001)
console.log(`x: ${x}`)


const ascii = testChessToAscii()
console.log(ascii)

const y = testLocatedPieces()
console.log('y', y)
