import { SortStep, SortDriver } from "./types";

export const bubbleSort: SortDriver = function* (arr: number[]) {
  const a = arr.slice();
  let comps = 0, swaps = 0;
  const steps: SortStep[] = [];
  for (let end = a.length - 1; end > 0; end--) {
    let swapped = false;
    for (let i = 0; i < end; i++) {
      const j = i + 1; comps++;
      if (a[i] > a[j]) {
        [a[i], a[j]] = [a[j], a[i]]; swaps++; swapped = true;
        const s: SortStep = { i, j, swap: true, array: a.slice(), comparisons: comps, swaps, note: "swap" };
        steps.push(s); yield s;
      } else {
        const s: SortStep = { i, j, swap: false, array: a.slice(), comparisons: comps, swaps, note: "no-swap" };
        steps.push(s); yield s;
      }
    }
    if (!swapped) break;
  }
  return steps;
};
