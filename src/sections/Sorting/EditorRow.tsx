import React from "react";
type Props = { values: number[]; onChange: (index: number, value: number) => void; };
export default function EditorRow({ values, onChange }: Props) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", gap: 6 }}>
        {values.map((v, i) => (
          <input key={i} type="number" value={v}
            onChange={(e) => onChange(i, Number(e.target.value))}
            style={{ width: 48, padding: 4, textAlign: "center",
                     borderRadius: 6, border: "1px solid #445",
                     background: "#1f253a", color: "white" }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 4, color: "#a4b0cf" }}>
        {values.map((_, i) => (<div key={i} style={{ width: 48, textAlign: "center" }}>{i}</div>))}
      </div>
    </div>
  );
}
