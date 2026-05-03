
## Project Overview

A chess engine built in **AssemblyScript** (compiled to WebAssembly), with a **Vue 3** frontend. The engine implements move generation and a alphabeta AI. The frontend uses [vue3-chessboard](https://github.com/qwerty084/vue3-chessboard) for board rendering.

## Commands

### AssemblyScript engine (in `asscript/`)

```bash
# Build both debug and release WASM
cd asscript && npm run asbuild

# Build release only
cd asscript && npm run asbuild:release

# Run tests
cd asscript && npm test
# or
node asscript/tests/index.js
```

### Vue frontend (root)

```bash
npm run dev      # dev server
npm run build    # production build
npm run preview  # preview production build
```

## Architecture

The project has two separate npm workspaces:

- **`asscript/`** — AssemblyScript chess engine, compiled to `asscript/build/release.wasm` + `asscript/build/release.js`
- **`src/`** — Vue 3 frontend (Vite + Tailwind CSS)

### Engine (`asscript/assembly/`)

The engine is written in AssemblyScript (TypeScript-like syntax that compiles to WASM). Key classes:

- **`Chess`** — Board state: holds a `Piece[]` array, castling rights, current player, and `bestMove`. Board coordinates use `(row, col)` where row 0 = rank 1 (white's back rank), row 7 = rank 8. Columns 0–7 = files a–h.
- **`Piece`** (base class) + subclasses `Pawn`, `Rook`, `Knight`, `Bishop`, `Queen`, `King` — Each subclass implements `possibleMoves(chess, kingSquare): Move[]` and `attacks(chess, square): bool`. The base class `clone()` must never be called directly — always use a subclass instance.
- **`Move`** — Represents a single move: type (`MOVE`, `EAT`, `KING_CASTLING`, `QUEEN_CASTLING`), the moving piece, destination square, promotion type, and a pre-computed `resultingChess: Chess`. Every move eagerly stores the resulting board state.
- **`Square`** — Simple `(rowIndex, colIndex)` value. `toString()` returns algebraic notation (e.g. `"e4"`).

### Square coordinates
```
row
 7   8 | r  n  b  q  k  b  n  r
 6   7 | p  p  p  p  p  p  p  p
 5   6 |
 4   5 |
 3   4 |
 2   3 |
 1   2 | P  P  P  P  P  P  P  P
 0   1 | R  N  B  Q  K  B  N  R
       +-----------------------
         a  b  c  d  e  f  g  h
         
col      0  1  2  3  4  5  6  7
```

### AI

`alphabeta()` in `asscript/assembly/index.ts` is a full alpha-beta search with pruning. `Chess.evaluate()` scores by material (Q=9, R=5, B=N=3, P=1, weighted ×100) plus mobility (number of legal moves for each side). The AI runs in a Web Worker (`src/chess.worker.js`) to avoid blocking the UI — the frontend sends a FEN string + move history + depth, and the worker responds with the best move string.

### Frontend (`src/`)

`App.vue` is the sole component. It:
1. Imports all engine functions directly from `/asscript/build/release.js` (the WASM glue module).
2. Manages a `chess: Chess` reference (a WASM object handle) in JS.
3. On each player move, looks up the matching move in `chessPossibleMoves()`, executes it via `moveResultingChess()`, then calls `chessBestMove()` after `alphabeta()` to get and play the AI response.

Move string format: `"<PIECE> <from><sep><to>"` e.g. `"P e2-e4"`, `"p d7xe5"`, `"K O-O"`. The frontend strips the first 3 characters (`substring(2)` → `"e4"`, `"d5"`) when passing moves to the vue3-chessboard API.


# Deployment
```
cd asscript
npm run asbuild
cd ..
npm run build
```

In production, the .wasm file is loaded as a ressource before being dynamically compiled and executed.

Lors du fetch du fichier .wasm, il a le mime-type application/octet-stream au lieu de application/wasm :
aller dans les devtools et cliquer sur le fichier .wasm et constater qu'il est servi par nginx (server: nginx) et que son mime-type est application/octer-stream)
--> adapter la config nginx:
```
    location ~ \.wasm$ {
        default_type application/wasm;
        try_files $uri =404;
    }
```

# Important issues

## Memory footprint

`Chess.clone()` shares piece references (does **not** deep-clone pieces) to minimize memory. Only pieces that actually move are cloned — see `cloneWithMovedPiece` / `cloneWithEatenPiece`.

## Blocking

Synchronous WASM computation blocks the entire main thread — CSS animations, DOM paints, everything --> use a web worker for alphabeta computation

## Game persistence on mobile

Mobile browsers often unload pages from memory when backgrounded --> persist game state to localStorage and restore it on mount

