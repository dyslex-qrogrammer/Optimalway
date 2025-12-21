export type SortStep = {
  i: number; j: number; swap?: boolean;
  array: number[]; comparisons: number; swaps: number; note?: string;
};
export type SortDriver = (arr: number[]) => Generator<SortStep, SortStep[], void>;

