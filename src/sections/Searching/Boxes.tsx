import React from "react";

type Props = {
  values: number[];
  active?: number;
  checked?: Set<number>;
  discarded?: Set<number>;
  found?: number;
};

export default function Boxes({ values, active, checked, discarded, found }: Props) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
      {values.map((v, i) => {
        const isFound = found === i;
        const isActive = active === i;
        const isChecked = checked?.has(i);
        const isDiscarded = discarded?.has(i);

        let bg = "#2a2f45";
        if (isDiscarded) bg = "#1b1f33";
        if (isChecked) bg = "#344f7a";
        if (isActive) bg = "#557ec8";
        if (isFound) bg = "#55efc4";

        return (
          <div key={i} style={{
            width: 52, padding: "10px 0",
            textAlign: "center",
            borderRadius: 10,
            background: bg,
            outline: "2px solid #0003",
            color: "white",
          }}>
            <div style={{ fontWeight: 800 }}>{v}</div>
            <div style={{ fontSize: 12, color: "#d7dced" }}>{i}</div>
          </div>
        );
      })}
    </div>
  );
}
