import assert from 'assert'
import {
   chessParse, chessPrint, chessPossibleMoves, moveToString,
   moveResultingChess, chessInCheck, chessIsWhiteToPlay, chessEvaluate,
   alphabeta, chessBestMove,
} from '../build/debug.js'

let passed = 0
let failed = 0

function test(name, fn) {
   try {
      fn()
      console.log(`  ✓ ${name}`)
      passed++
   } catch (e) {
      console.error(`  ✗ ${name}: ${e.message}`)
      failed++
   }
}

// ── FEN round-trip ────────────────────────────────────────────────────────────
console.log('FEN')

test('parse + print round-trips initial position', () => {
   const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
   assert.strictEqual(chessPrint(chessParse(fen)), fen)
})

test('isWhiteToPlay reflects FEN active color', () => {
   const white = chessParse('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
   const black = chessParse('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1')
   assert.strictEqual(chessIsWhiteToPlay(white), true)
   assert.strictEqual(chessIsWhiteToPlay(black), false)
})

// ── Move generation ───────────────────────────────────────────────────────────
console.log('Move generation')

test('white has 20 moves from start', () => {
   const chess = chessParse('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
   assert.strictEqual(chessPossibleMoves(chess).length, 20)
})

test('black has 20 moves from start', () => {
   const chess = chessParse('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1')
   assert.strictEqual(chessPossibleMoves(chess).length, 20)
})

test('move string format is correct', () => {
   const chess = chessParse('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
   const strs = chessPossibleMoves(chess).map(m => moveToString(m))
   assert.ok(strs.includes('P e2-e4'), `missing 'P e2-e4', got: ${strs.join(', ')}`)
   assert.ok(strs.includes('P e2-e3'), `missing 'P e2-e3'`)
   assert.ok(strs.includes('N g1-f3'), `missing 'N g1-f3'`)
})

test('resulting chess toggles active color', () => {
   const chess = chessParse('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
   const moves = chessPossibleMoves(chess)
   const after = moveResultingChess(moves[0])
   assert.strictEqual(chessIsWhiteToPlay(after), false)
})

// ── Check detection ───────────────────────────────────────────────────────────
console.log('Check')

test('not in check at start', () => {
   const chess = chessParse('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
   assert.strictEqual(chessInCheck(chess, true), false)
})

test('detects check1', () => {
   // white to play, queen on e2 attacks white king on e1
   const chess = chessParse('4k3/8/8/8/8/8/4q3/4K3 w ---- - 0 1')
   assert.strictEqual(chessInCheck(chess, true), true)
})

test('detects check2', () => {
   // black ke5 is attacked by Pf4
   const chess = chessParse('8/8/8/4k3/5P2/8/PPPP2PP/4K3 b ---- - 0 1')
   assert.strictEqual(chessInCheck(chess, false), true)
})

// ── Evaluation ────────────────────────────────────────────────────────────────
console.log('Evaluation')

test('equal material scores symmetrically near zero', () => {
   const chess = chessParse('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
   assert.strictEqual(chessEvaluate(chess), 0)
})

test('white up a queen scores positive', () => {
   const chess = chessParse('rnb1kbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
   assert.ok(chessEvaluate(chess) > 0, 'expected positive score')
})

// ── AI ────────────────────────────────────────────────────────────────────────
console.log('AI')

test('alphabeta returns a best move', () => {
   const chess = chessParse('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
   alphabeta(chess, 2)
   const best = chessBestMove(chess)
   assert.ok(best !== null, 'expected a best move')
   assert.ok(moveToString(best).length > 0)
})

test('resulting chess after move differs from original', () => {
   const chess = chessParse('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
   const after = moveResultingChess(chessPossibleMoves(chess)[0])
   assert.notStrictEqual(chessPrint(chess), chessPrint(after))
})

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
