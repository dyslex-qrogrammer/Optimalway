export type SearchStep = {
  i?: number;                 // current index checked (linear)
  low?: number; mid?: number; high?: number; // binary window
  foundIndex?: number;        // if found
  done: boolean;
  note?: string;
  checked: number[];          // indices checked so far
  discarded: number[];        // indices eliminated (binary)
};

export type SearchDriver = (
  arr: number[],
  target: number
) => Generator<SearchStep, SearchStep, void>;
