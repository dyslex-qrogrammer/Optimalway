import type { SearchDriver, SearchStep } from "./types";

export const binarySearch: SearchDriver = function* (arr, target) {
  let low = 0, high = arr.length - 1;
  const checked: number[] = [];
  const discarded: number[] = [];

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    checked.push(mid);

    const step: SearchStep = {
      low, mid, high,
      done: arr[mid] === target,
      foundIndex: arr[mid] === target ? mid : undefined,
      checked: checked.slice(),
      discarded: discarded.slice(),
      note: `Check mid=${mid}`,
    };
    yield step;
    if (step.done) return step;

    if (arr[mid] < target) {
      for (let i = low; i <= mid; i++) discarded.push(i);
      low = mid + 1;
    } else {
      for (let i = mid; i <= high; i++) discarded.push(i);
      high = mid - 1;
    }
  }

  const final: SearchStep = {
    low, high,
    done: true,
    checked,
    discarded,
    note: "Not found",
  };
  return final;
};
