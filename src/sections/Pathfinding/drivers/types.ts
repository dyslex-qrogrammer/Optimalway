export type Cell = { r: number; c: number };

export type Step = {
  current?: Cell;                 // node expanded this tick
  visited: string[];              // new visited keys this step
  frontier: string[];             // queue after expansion
  parents: Record<string, string | undefined>;  // "r,c" -> parentKey
  done?: boolean;                 // true when finished
  path?: string[];                // reconstructed path if found
};

export type Driver = (
  rows: number, cols: number,
  start: Cell, goal: Cell,
  walls: Set<string>
) => Generator<Step, Step, void>;
