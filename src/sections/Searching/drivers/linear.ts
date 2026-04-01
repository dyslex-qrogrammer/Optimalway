import type { SearchDriver, SearchStep } from "./types";

export const linearSearch: SearchDriver = function* (arr, target) {
  const checked: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    checked.push(i);
    const step: SearchStep = {
      i,
      done: arr[i] === target,
      foundIndex: arr[i] === target ? i : undefined,
      checked: checked.slice(),
      discarded: [],
      note: `Check index ${i}`,
    };
    yield step;
    if (step.done) return step;
  }
  const final: SearchStep = {
    done: true,
    checked,
    discarded: [],
    note: "Not found",
  };
  return final;
};
