// src/sections/Sorting/Bars.tsx
import React from "react";

/**
 * Props the Bars component needs to draw.
 */
type Props = {
  // The data to draw. Example: [29, 10, 14, 37, 14]
  values: number[];

  // Optional: highlight two active indices (like i and j during a comparison).
  // If not provided, nothing is highlighted.
  active?: { i?: number; j?: number };

  // Optional: highlight any extra indices (e.g., elements already in place).
  highlight?: number[];

  // Optional: max pixel height of the tallest bar. Default = 240px.
  height?: number;
};

/**
 * Bars = PURE RENDERER
 * - No local state
 * - No algorithm logic
 * - Just turns numbers into divs with heights
 */
export default function Bars({ values, active, highlight, height = 240 }: Props) {
  // 1) Normalize heights: find the largest number so we can scale 0..max → 0..height (pixels).
  //    Use Math.max(...values, 1) so we never divide by 0 if values is empty or all zeros.
  const max = Math.max(...values, 1);

  // 2) The outer wrapper is a flex row aligned to the bottom,
  //    so all bars "grow upward" from a common baseline.
  return (
    <div style={{ display: "flex", alignItems: "end", gap: 2, height }}>
      {values.map((v, idx) => {
        // 3) Compute this bar's pixel height using linear scaling.
        const h = (v / max) * height;

        // 4) Decide coloring for highlights.
        const isActive = active && (idx === active.i || idx === active.j);
        const isHi = highlight?.includes(idx);

        // 5) Render one bar = one <div>. Key must be stable; index is OK for static order.
        return (
          <div
            key={idx}
            style={{
              // Each bar gets an equal fraction of the total width.
              width: `${100 / values.length}%`,

              // The actual height in pixels we computed above.
              height: h,

              // Color logic: active > highlighted > default.
              background: isActive ? "#ff7675" : isHi ? "#55efc4" : "#74b9ff",

              // Smoothly animate height changes when the array updates step-by-step.
              transition: "height 120ms",
            }}
            // Tooltip to show the numeric value on hover.
            title={`${v}`}
          />
        );
      })}
    </div>
  );
}
