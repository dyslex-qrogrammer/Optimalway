import React, { useEffect, useRef, useState } from "react";
import Boxes from "./Boxes";
import { linearSearch } from "./drivers/linear";
import { binarySearch } from "./drivers/binary";
import type { SearchStep } from "./drivers/types";

function makeArray(n = 8) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 30) + 1);
}

export default function SearchingPage() {
  const [values, setValues] = useState<number[]>(() => makeArray(8));
  const [target, setTarget] = useState<number>(values[0] ?? 10);
  const [algo, setAlgo] = useState<"linear" | "binary">("linear");
  const [speed, setSpeed] = useState(250);
  const [playing, setPlaying] = useState(false);

  const genRef = useRef<Generator<SearchStep, SearchStep, void> | null>(null);
  const [step, setStep] = useState<SearchStep | null>(null);
  const [undo, setUndo] = useState<SearchStep[]>([]);

  // Binary needs sorted array
  const sortedValues = algo === "binary" ? values.slice().sort((a,b)=>a-b) : values;
  const isSorted = values.every((v, i, a) => i === 0 || a[i-1] <= v);

  useEffect(() => {
    const arr = algo === "binary" ? sortedValues : values;
    genRef.current = (algo === "binary" ? binarySearch : linearSearch)(arr, target);
    setStep(null);
    setUndo([]);
    setPlaying(false);
  }, [values, target, algo]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const g = genRef.current; if (!g) return;
      const r = g.next();
      if (r.done) { setPlaying(false); setStep(r.value); return; }
      setUndo(u => [...u, r.value]);
      setStep(r.value as SearchStep);
      if ((r.value as SearchStep).done) setPlaying(false);
    }, speed);
    return () => clearInterval(id);
  }, [playing, speed]);

  const onNext = () => {
    const g = genRef.current; if (!g) return;
    const r = g.next();
    setStep(r.value as SearchStep);
    if (!r.done) setUndo(u => [...u, r.value as SearchStep]);
    if ((r.value as SearchStep).done) setPlaying(false);
  };

  const onUndo = () => {
    setPlaying(false);
    setUndo(u => {
      if (u.length === 0) return u;
      const next = u.slice(0, -1);
      setStep(next.length ? next[next.length - 1] : null);
      return next;
    });
  };

  const onRandom = () => {
    setPlaying(false);
    const arr = makeArray(8);
    setValues(arr);
    setTarget(arr[0] ?? 10);
  };

  const onEdit = (i: number, val: number) => {
    setValues(prev => {
      const next = prev.slice();
      next[i] = Number.isFinite(val) ? val : 0;
      return next;
    });
  };

  const onAdd = () => setValues(prev => [...prev, Math.floor(Math.random() * 30) + 1]);

  const arrShown = algo === "binary" ? sortedValues : values;
  const checkedSet = new Set(step?.checked ?? []);
  const discardedSet = new Set(step?.discarded ?? []);

  const active =
    algo === "linear" ? step?.i :
    algo === "binary" ? step?.mid : undefined;

  const found = step?.foundIndex;

  return (
    <main className="page">
      <h2>Searching</h2>

      <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
        <button onClick={onRandom}>Random</button>
        <button onClick={onAdd}>+ Add</button>

        <label> Target:
          <input type="number" value={target} onChange={e=>setTarget(Number(e.target.value))}
                 style={{ marginLeft: 6, width: 70 }} />
        </label>

        <label> Algorithm:
          <select value={algo} onChange={e=>setAlgo(e.target.value as any)} style={{ marginLeft: 6 }}>
            <option value="linear">Linear</option>
            <option value="binary">Binary</option>
          </select>
        </label>

        <button onClick={onNext}>Next</button>
        {!playing ? <button onClick={()=>setPlaying(true)}>Play</button>
                  : <button onClick={()=>setPlaying(false)}>Pause</button>}
        <button onClick={onUndo} disabled={undo.length===0}>Undo</button>

        <label> Speed(ms):
          <input type="range" min={80} max={600} step={20} value={speed}
                 onChange={e=>setSpeed(Number(e.target.value))} />
          <span style={{ marginLeft: 6 }}>{speed}</span>
        </label>

        <span>Applicable? {algo==="binary" ? (isSorted ? "✓" : "Auto-sorted view") : "✓"}</span>
      </div>

      <Boxes
        values={arrShown}
        active={active}
        checked={checkedSet}
        discarded={algo==="binary" ? discardedSet : undefined}
        found={found}
      />

      <div style={{ marginTop: 12 }}>
        <div style={{ color:"#a4b0cf", marginBottom: 6 }}>Edit values:</div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {values.map((v,i)=>(
            <input key={i} type="number" value={v}
              onChange={(e)=>onEdit(i, Number(e.target.value))}
              style={{ width: 52, padding: 6, borderRadius: 8,
                       border: "1px solid #445", background:"#1f253a", color:"white", textAlign:"center" }}
            />
          ))}
        </div>
      </div>

      <p style={{ color:"#a4b0cf" }}>
        Linear scans one-by-one. Binary discards halves but requires sorted data (we show an auto-sorted view when selected).
      </p>
    </main>
  );
}
