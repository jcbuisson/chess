async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.assign(Object.create(globalThis), imports.env || {}, {
      abort(message, fileName, lineNumber, columnNumber) {
        // ~lib/builtins/abort(~lib/string/String | null?, ~lib/string/String | null?, u32?, u32?) => void
        message = __liftString(message >>> 0);
        fileName = __liftString(fileName >>> 0);
        lineNumber = lineNumber >>> 0;
        columnNumber = columnNumber >>> 0;
        (() => {
          // @external.js
          throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`);
        })();
      },
      "console.log"(text) {
        // ~lib/bindings/dom/console.log(~lib/string/String) => void
        text = __liftString(text >>> 0);
        console.log(text);
      },
    }),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    alphaBeta(depth, maxDepth, nodeIndex, isMaximizingPlayer, scores, alpha, beta) {
      // assembly/index/alphaBeta(i32, i32, i32, bool, ~lib/staticarray/StaticArray<i32>, i32, i32) => i32
      isMaximizingPlayer = isMaximizingPlayer ? 1 : 0;
      scores = __lowerStaticArray(__setU32, 9, 2, scores, Int32Array) || __notnull();
      return exports.alphaBeta(depth, maxDepth, nodeIndex, isMaximizingPlayer, scores, alpha, beta);
    },
    createInitialBoard() {
      // assembly/index/createInitialBoard() => assembly/classes/Chess/Chess
      return __liftInternref(exports.createInitialBoard() >>> 0);
    },
    chessToAscii(chess) {
      // assembly/index/chessToAscii(assembly/classes/Chess/Chess) => ~lib/string/String
      chess = __lowerInternref(chess) || __notnull();
      return __liftString(exports.chessToAscii(chess) >>> 0);
    },
    moveToString(move) {
      // assembly/index/moveToString(assembly/classes/Move/Move) => ~lib/string/String
      move = __lowerInternref(move) || __notnull();
      return __liftString(exports.moveToString(move) >>> 0);
    },
    moveResultingChess(move) {
      // assembly/index/moveResultingChess(assembly/classes/Move/Move) => assembly/classes/Chess/Chess
      move = __lowerInternref(move) || __notnull();
      return __liftInternref(exports.moveResultingChess(move) >>> 0);
    },
    chessPossibleMoves(chess) {
      // assembly/index/chessPossibleMoves(assembly/classes/Chess/Chess) => ~lib/array/Array<assembly/classes/Move/Move>
      chess = __lowerInternref(chess) || __notnull();
      return __liftArray(pointer => __liftInternref(__getU32(pointer)), 2, exports.chessPossibleMoves(chess) >>> 0);
    },
    chessTogglePlayer(chess) {
      // assembly/index/chessTogglePlayer(assembly/classes/Chess/Chess) => bool
      chess = __lowerInternref(chess) || __notnull();
      return exports.chessTogglePlayer(chess) != 0;
    },
  }, exports);
  function __liftString(pointer) {
    if (!pointer) return null;
    const
      end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1,
      memoryU16 = new Uint16Array(memory.buffer);
    let
      start = pointer >>> 1,
      string = "";
    while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
    return string + String.fromCharCode(...memoryU16.subarray(start, end));
  }
  function __liftArray(liftElement, align, pointer) {
    if (!pointer) return null;
    const
      dataStart = __getU32(pointer + 4),
      length = __dataview.getUint32(pointer + 12, true),
      values = new Array(length);
    for (let i = 0; i < length; ++i) values[i] = liftElement(dataStart + (i << align >>> 0));
    return values;
  }
  function __lowerStaticArray(lowerElement, id, align, values, typedConstructor) {
    if (values == null) return 0;
    const
      length = values.length,
      buffer = exports.__pin(exports.__new(length << align, id)) >>> 0;
    if (typedConstructor) {
      new typedConstructor(memory.buffer, buffer, length).set(values);
    } else {
      for (let i = 0; i < length; i++) lowerElement(buffer + (i << align >>> 0), values[i]);
    }
    exports.__unpin(buffer);
    return buffer;
  }
  class Internref extends Number {}
  const registry = new FinalizationRegistry(__release);
  function __liftInternref(pointer) {
    if (!pointer) return null;
    const sentinel = new Internref(__retain(pointer));
    registry.register(sentinel, pointer);
    return sentinel;
  }
  function __lowerInternref(value) {
    if (value == null) return 0;
    if (value instanceof Internref) return value.valueOf();
    throw TypeError("internref expected");
  }
  const refcounts = new Map();
  function __retain(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount) refcounts.set(pointer, refcount + 1);
      else refcounts.set(exports.__pin(pointer), 1);
    }
    return pointer;
  }
  function __release(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount === 1) exports.__unpin(pointer), refcounts.delete(pointer);
      else if (refcount) refcounts.set(pointer, refcount - 1);
      else throw Error(`invalid refcount '${refcount}' for reference '${pointer}'`);
    }
  }
  function __notnull() {
    throw TypeError("value must not be null");
  }
  let __dataview = new DataView(memory.buffer);
  function __setU32(pointer, value) {
    try {
      __dataview.setUint32(pointer, value, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      __dataview.setUint32(pointer, value, true);
    }
  }
  function __getU32(pointer) {
    try {
      return __dataview.getUint32(pointer, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      return __dataview.getUint32(pointer, true);
    }
  }
  return adaptedExports;
}
export const {
  memory,
  alphaBeta,
  createInitialBoard,
  chessToAscii,
  moveToString,
  moveResultingChess,
  chessPossibleMoves,
  chessTogglePlayer,
} = await (async url => instantiate(
  await (async () => {
    const isNodeOrBun = typeof process != "undefined" && process.versions != null && (process.versions.node != null || process.versions.bun != null);
    if (isNodeOrBun) { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
    else { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
  })(), {
  }
))(new URL("release.wasm", import.meta.url));
