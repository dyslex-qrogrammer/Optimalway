import type { Driver, Step, Cell } from "./types";

const K = (r:number,c:number)=>`${r},${c}`;

export const bfs: Driver = function* (rows, cols, start, goal, walls) {
  const startK = K(start.r, start.c);
  const goalK  = K(goal.r, goal.c);

  const q: string[] = [startK];
  const seen = new Set<string>([startK]);
  const parents: Record<string, string | undefined> = { [startK]: undefined };

  const deltas = [[1,0],[-1,0],[0,1],[0,-1]];

  while (q.length) {
    const curK = q.shift()!;
    const [r, c] = curK.split(",").map(Number);
    const current: Cell = { r, c };

    const newlyVisited: string[] = [];
    for (const [dr, dc] of deltas) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const nk = K(nr, nc);
      if (walls.has(nk) || seen.has(nk)) continue;
      seen.add(nk);
      parents[nk] = curK;
      q.push(nk);
      newlyVisited.push(nk);
    }

    const step: Step = {
      current,
      visited: newlyVisited,
      frontier: q.slice(),
      parents: { ...parents },
      done: false,
    };

    if (curK === goalK) {
      const path: string[] = [];
      let k: string | undefined = curK;
      while (k !== undefined) { path.push(k); k = parents[k]; }
      path.reverse();
      step.done = true; step.path = path;
      yield step;
      return step;
    }

    yield step;
  }

  const final: Step = { current: undefined, visited: [], frontier: [], parents: {}, done: true };
  return final;
};

