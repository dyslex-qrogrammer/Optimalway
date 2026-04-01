import React, { useEffect, useRef, useState } from "react";
import Grid from "./Grid";
import { bfs } from "./drivers/bfs";
import type { Step } from "./drivers/types";

type Cell = { r: number; c: number };
const K = (r:number,c:number)=>`${r},${c}`;

export default function PathPage() {
  const [rows, setRows] = useState(12);
  const [cols, setCols] = useState(18);

  const [start, setStart] = useState<Cell>({ r: 2, c: 2 });
  const [goal,  setGoal]  = useState<Cell>({ r: 9, c: 14 });

  const [walls, setWalls] = useState<Set<string>>(()=>new Set());
  const [mode, setMode] = useState<"wall"|"start"|"goal">("wall");

  const [step, setStep] = useState<Step | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(80);

  const genRef = useRef<Generator<Step, Step, void> | null>(null);

  // Whenever grid or endpoints change, rebuild BFS
  useEffect(() => {
    genRef.current = bfs(rows, cols, start, goal, walls);
    setStep(null);
    setPlaying(false);
  }, [rows, cols, start.r, start.c, goal.r, goal.c, walls]);

  // Play loop (like Module 2)
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const g = genRef.current; if (!g) return;
      const r = g.next();
      if (r.done) { setPlaying(false); setStep(r.value); return; }
      setStep(r.value as Step);
    }, speed);
    return () => clearInterval(id);
  }, [playing, speed]);

  // Click editing (paint walls / set start / set goal)
  const onCellClick = (cell: Cell) => {
    if (mode === "wall") {
      setWalls(prev => {
        const next = new Set(prev);
        const k = K(cell.r, cell.c);
        next.has(k) ? next.delete(k) : next.add(k);
        return next;
      });
    } else if (mode === "start") {
      setStart(cell);
    } else {
      setGoal(cell);
    }
  };

  const onStep = () => {
    const g = genRef.current; if (!g) return;
    const r = g.next(); setStep(r.value as Step);
    if (r.done) setPlaying(false);
  };

  const onReset = () => {
    setPlaying(false);
    genRef.current = bfs(rows, cols, start, goal, walls);
    setStep(null);
  };

  const visited = new Set(step?.visited ?? []);
  const frontier = new Set(step?.frontier ?? []);
  const path = step?.path ? new Set(step.path) : undefined;
  const optimal = step?.done && !!step?.path; // BFS optimal on unweighted grid

  return (
    <main className="page">
      <h2>Road Routing (Grid Pathfinding)</h2>

      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:10 }}>
        <button onClick={()=>setMode("wall")}  style={{fontWeight:mode==="wall"?"700":undefined}}>Wall</button>
        <button onClick={()=>setMode("start")} style={{fontWeight:mode==="start"?"700":undefined}}>Start</button>
        <button onClick={()=>setMode("goal")}  style={{fontWeight:mode==="goal"?"700":undefined}}>Goal</button>

        {!playing ? <button onClick={()=>setPlaying(true)}>Play</button>
                  : <button onClick={()=>setPlaying(false)}>Pause</button>}
        <button onClick={onStep}>Step</button>
        <button onClick={onReset}>Reset</button>

        <label> Speed (ms)
          <input type="range" min={30} max={300} step={10}
                 value={speed} onChange={e=>setSpeed(Number(e.target.value))}/>
          <span style={{ marginLeft:6 }}>{speed}</span>
        </label>

        <span>Mode: {mode}</span>
        <span>Optimal? {optimal ? "✓" : "—"}</span>
        {step?.path && <span>Path length: {step.path.length - 1}</span>}
      </div>

      <Grid rows={rows} cols={cols}
            start={start} goal={goal}
            walls={walls}
            visited={visited} frontier={frontier} path={path}
            onCellClick={onCellClick}/>
      <p style={{ color:"#a4b0cf", marginTop:10 }}>
        Paint <b>Wall</b>, set <b>Start</b>/<b>Goal</b>, then <b>Step</b> or <b>Play</b>.
        BFS is optimal on unweighted grids.
      </p>
    </main>
  );
}
