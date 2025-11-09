import React, { useState, useEffect } from "react";
import plopSfx from "/public/plop.mp3";
import pauhSfx from "/public/pauh.mp3";
import pilt1 from "/public/1.png";
import pilt2 from "/public/2.png";
import pilt3 from "/public/3.png";
import pilt4 from "/public/4.png";
import pilt5 from "/public/5.png";
import pilt6 from "/public/6.png";
import pilt7 from "/public/7.png";
import pilt8 from "/public/8.png";
import pilt9 from "/public/9.png";
import pilt10 from "/public/10.png";
import pilt11 from "/public/11.png";
import pilt12 from "/public/12.png";
import pilt13 from "/public/13.png";
import pilt14 from "/public/14.png";
import logo from "/public/logo.png";
const VFX_IMAGES = [
  pilt1,
  pilt2,
  pilt3,
  pilt4,
  pilt5,
  pilt6,
  pilt7,
  pilt8,
  pilt9,
  pilt10,
  pilt11,
  pilt12,
  pilt13,
  pilt14
];



const GRID_SIZE = 9;

// Define type for a shape
type Cell = [number, number];
type Shape = Cell[];

// Shapes (each shape = array of [r, c] offsets)
const SHAPES: Shape[] = [
  [[0, 0]], // single
  [[0, 0], [0, 1]], // 1x2
  [[0, 0], [1, 0]], // 2x1
  [[0, 0], [0, 1], [0, 2]], // 1x3
  [[0, 0], [1, 0], [2, 0]], // 3x1
  [[0, 0], [0, 1], [1, 0], [1, 1]], // 2x2
  [[0, 0], [0, 1], [1, 0]], // small corner
  [[0, 0], [1, 0], [1, 1]], // L
  [[0, 0], [0, 1], [1, 1]], // mirrored L
  [[0, 0], [0, 1], [0, 2], [1, 2]], // L shape
];

// Generate a random shape
function randomShape(): Shape {
  const idx = Math.floor(Math.random() * SHAPES.length);
  const shape = SHAPES[idx];
  const minR = Math.min(...shape.map((s) => s[0]));
  const minC = Math.min(...shape.map((s) => s[1]));
  return shape.map((s) => [s[0] - minR, s[1] - minC]) as Shape;
}

function emptyGrid(): number[][] {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

// Component starts
const Blakudoku: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(() => emptyGrid());
  const [pieces, setPieces] = useState<(Shape | null)[]>(() => [
    randomShape(),
    randomShape(),
    randomShape(),
  ]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Helper: check if a piece can be placed
  const canPlace = (shape: Shape, baseR: number, baseC: number, g = grid): boolean => {
    for (const [dr, dc] of shape) {
      const r = baseR + dr;
      const c = baseC + dc;
      if (r < 0 || c < 0 || r >= GRID_SIZE || c >= GRID_SIZE) return false;
      if (g[r][c] !== 0) return false;
    }
    isCellInHoverPreview;
    return true;
  };

const playSound = (url: string) => {
  const audio = new Audio(url);
  audio.volume = 0.4;
  audio.currentTime = 0;
  audio.play().catch(() => {});
};


  // Place piece and clear
  const placePiece = (index: number, baseR: number, baseC: number): boolean => {
    if (gameOver) return false;
    const shape = pieces[index];
    if (!shape || !canPlace(shape, baseR, baseC)) return false;

    setGrid((prev) => {
      const copy = prev.map((r) => [...r]);
      let placedCells = 0;

      for (const [dr, dc] of shape) {
        const r = baseR + dr;
        const c = baseC + dc;
        if (copy[r][c] === 0) {
          copy[r][c] = 1;
          placedCells++;
        }
      }

      if (placedCells > 0) {
      playSound(plopSfx);
    }

      setScore((s) => s + placedCells * 10);

      // Clear rows, cols, boxes
      const rowsToClear: number[] = [];
      const colsToClear: number[] = [];
      const boxesToClear: [number, number][] = [];

      // Rows
      for (let r = 0; r < GRID_SIZE; r++) {
        if (copy[r].every((v) => v === 1)) rowsToClear.push(r);
      }

      // Columns
      for (let c = 0; c < GRID_SIZE; c++) {
        let full = true;
        for (let r = 0; r < GRID_SIZE; r++) {
          if (copy[r][c] === 0) full = false;
        }
        if (full) colsToClear.push(c);
      }

      // 3x3 boxes
      for (let br = 0; br < 3; br++) {
        for (let bc = 0; bc < 3; bc++) {
          let full = true;
          for (let r = br * 3; r < br * 3 + 3; r++) {
            for (let c = bc * 3; c < bc * 3 + 3; c++) {
              if (copy[r][c] === 0) full = false;
            }
          }
          if (full) boxesToClear.push([br, bc]);
        }
      }

      let clearedCells = 0;
      // Clear rows
      for (const r of rowsToClear) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (copy[r][c] === 1) {
            copy[r][c] = 0;
            clearedCells++;
          }
        }
      }
      // Clear cols
      for (const c of colsToClear) {
        for (let r = 0; r < GRID_SIZE; r++) {
          if (copy[r][c] === 1) {
            copy[r][c] = 0;
            clearedCells++;
          }
        }
      }
      // Clear boxes
      for (const [br, bc] of boxesToClear) {
        for (let r = br * 3; r < br * 3 + 3; r++) {
          for (let c = bc * 3; c < bc * 3 + 3; c++) {
            if (copy[r][c] === 1) {
              copy[r][c] = 0;
              clearedCells++;
            }
          }
        }
      }
      if (clearedCells > 0) {
        playSound(pauhSfx);
        triggerClearVFX();
        setScore(
          (s) =>
            s +
            clearedCells * 20 +
            (rowsToClear.length + colsToClear.length + boxesToClear.length) * 50
        );
      }

      return copy;
    });

    // Replace used piece
    setPieces((prev) => {
      const next = [...prev];
      next[index] = null;
      if (next.every((p) => p === null)) {
        return [randomShape(), randomShape(), randomShape()];
      }
      return next;
    });

    setSelectedIndex(null);
    return true;
  };

  const hasAnyMove = (g = grid, pcs = pieces): boolean => {
    for (const p of pcs) {
      if (!p) continue;
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (canPlace(p, r, c, g)) return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    setGameOver(!hasAnyMove());
  }, [grid, pieces]);

  const reset = () => {
    setGrid(emptyGrid());
    setPieces([randomShape(), randomShape(), randomShape()]);
    setScore(0);
    setSelectedIndex(null);
    setGameOver(false);
  };

  // Piece preview
  const PiecePreview: React.FC<{
    shape: Shape;
    index: number;
    selected: boolean;
    onSelect: (idx: number) => void;
  }> = ({ shape, index, selected, onSelect }) => {
    const size = 5;
    const keyCells = new Set(shape.map(([r, c]) => `${r}_${c}`));

    return (
      <button
        className={`w-20 h-20 rounded-2xl p-1 flex items-center justify-center border ${
          selected ? "ring-2 ring-blue-400" : "border-slate-700"
        } bg-slate-900`}
        onClick={() => onSelect(index)}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${size}, 1rem)`,
            gap: "2px",
          }}
        >
          {Array.from({ length: size * size }).map((_, i) => {
            const r = Math.floor(i / size);
            const c = i % size;
            const isOn = keyCells.has(`${r}_${c}`);
            return (
              <div
                key={i}
                className={`w-3 h-3 ${
                  isOn ? "bg-blue-400 rounded-sm" : "bg-slate-800"
                }`}
              />
            );
          })}
        </div>
      </button>
    );
  };

  // Trigger a quick clear VFX animation
const triggerClearVFX = () => {
  const el = document.getElementById("clear-vfx") as HTMLImageElement | null;
  if (!el) return;

  // Pick a random image
  const randomImage =
    VFX_IMAGES[Math.floor(Math.random() * VFX_IMAGES.length)];
  el.src = randomImage;

  // Reset animation state
  el.classList.remove("opacity-0", "scale-0");
  el.classList.add("opacity-100", "scale-100");

  // Fade back out after animation
  setTimeout(() => {
    el.classList.remove("opacity-100", "scale-100");
    el.classList.add("opacity-0", "scale-0");
  }, 400);
};

const [hoverCell, setHoverCell] = useState<{ r: number; c: number } | null>(null);
const isCellInHoverPreview = (r: number, c: number): boolean => {
  if (!hoverCell || selectedIndex === null) return false;
  const shape = pieces[selectedIndex];
  if (!shape) return false;
  return shape.some(([dr, dc]) => r === hoverCell.r + dr && c === hoverCell.c + dc);
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
                src= { logo }          // path to your image
                alt="Bläkudoku logo" 
                className="w-26 h-26" 
            />
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Bläkudoku – Isadepäeva Special</h1>
                <p className="text-sm text-slate-400">
                  Vali klots, et seda mängulauale panna.
                </p>
            </div>
        </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Score</div>
            <div className="text-2xl font-mono">{score}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr,260px] gap-4">
          {/* Board */}
          <div className="bg-slate-900 p-3 rounded-2xl shadow-lg">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                gap: "4px",
              }}
            >
              {grid.map((row, r) =>
                row.map((cell, c) => (
                  <div
                    key={`${r}_${c}`}
                    onMouseEnter={() => setHoverCell({ r, c })}
                    onMouseLeave={() => setHoverCell(null)}
                    onClick={() => {
                      if (selectedIndex !== null) {
                        const placed = placePiece(selectedIndex, r, c);
                        if (!placed && navigator.vibrate) navigator.vibrate(30);
                      }
                    }}
                    className={`aspect-square rounded-md flex items-center justify-center border transition-all duration-100 ease-in-out
                        ${
                        cell
                            ? "bg-blue-500 border-blue-400"
                            : isCellInHoverPreview(r, c) && selectedIndex
                            ? canPlace(pieces[selectedIndex]!, hoverCell!.r, hoverCell!.c)
                            ? "bg-blue-400/40 border-blue-300/60"   // valid placement preview
                            : "bg-rose-500/30 border-rose-400/50"  // invalid placement preview
                            : "bg-slate-800 border-slate-700"
                        }`}
                  />
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-3">
            <div className="bg-slate-900 p-3 rounded-2xl shadow-inner">
              <div className="text-sm text-slate-400 mb-2">Järgmised klotsid</div>
              <div className="flex gap-3">
                {pieces.map((p, i) =>
                  p ? (
                    <PiecePreview
                      key={i}
                      shape={p}
                      index={i}
                      selected={selectedIndex === i}
                      onSelect={(idx) =>
                        setSelectedIndex(idx === selectedIndex ? null : idx)
                      }
                    />
                  ) : (
                    <div
                      key={i}
                      className="w-20 h-20 rounded-2xl border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-600"
                    >
                      —
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-2xl flex flex-col gap-2">
              <button
                onClick={reset}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 shadow-md text-white font-semibold"
              >
                Uus mäng
              </button>
              {gameOver && (
                <div className="bg-rose-900/20 border border-rose-700 p-3 rounded-2xl text-center">
                  <div className="font-bold text-rose-300">Mäng läbi, aga ikka Eesti #1!</div>
                  <div className="text-sm text-rose-200">
                    Final Score: {score}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Clear visual effect overlay */}
        <img
        id="clear-vfx"
        src= {pilt1}
        alt="tubli!"
        className="pointer-events-none fixed inset-0 m-auto opacity-0 scale-0 transition-all duration-500 ease-out w-40 h-40 opacity-90"
        />
    </div>
  );
};

export default Blakudoku;
