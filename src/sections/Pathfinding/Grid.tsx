import React from "react";

export type Cell = { r: number; c: number };
type Props = {
  rows: number; cols: number;
  start: Cell; goal: Cell;
  walls: Set<string>;          // keys "r,c"
  visited?: Set<string>;       // colored as explored
  frontier?: Set<string>;      // queue contents
  path?: Set<string>;          // final (when found)
  onCellClick?: (cell: Cell) => void;
};

const key = (r:number,c:number)=>`${r},${c}`;

export default function Grid({
  rows, cols, start, goal, walls, visited, frontier, path, onCellClick
}: Props) {
  const size = 24; // px per cell
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, ${size}px)`,
      gridTemplateRows: `repeat(${rows}, ${size}px)`,
      gap: 2, userSelect: "none",
    }}>
      {Array.from({ length: rows * cols }, (_, idx) => {
        const r = Math.floor(idx / cols), c = idx % cols;
        const k = key(r, c);
        const isStart = r===start.r && c===start.c;
        const isGoal  = r===goal.r  && c===goal.c;
        const isWall  = walls.has(k);
        const isVis   = visited?.has(k);
        const isFront = frontier?.has(k);
        const isPath  = path?.has(k);

        let bg = "#2a2f45";
        if (isWall)  bg = "#1b1f33";
        if (isVis)   bg = "#344f7a";
        if (isFront) bg = "#557ec8";
        if (isPath)  bg = "#55efc4";
        if (isGoal)  bg = "#ff7675";
        if (isStart) bg = "#f9ca24";

        return (
          <div key={k}
            onClick={() => onCellClick?.({ r, c })}
            style={{
              width: size, height: size, background: bg,
              borderRadius: 4, cursor: onCellClick ? "pointer" : "default"
            }}
            title={k}
          />
        );
      })}
    </div>
  );
}
