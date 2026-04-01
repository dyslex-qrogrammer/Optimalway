import { TraversalStep } from "./types";

export function bfsSteps(
  adjacency: Record<number, number[]>,
  start: number
): TraversalStep[] {
  const visited = new Set<number>();
  const queue: number[] = [start];
  const steps: TraversalStep[] = [];
  const traversedEdges: Array<[number, number]> = [];

  visited.add(start);

  steps.push({
    current: null,
    visited: [start],
    frontier: [...queue],
    traversedEdges: [],
  });

  while (queue.length > 0) {
    const current = queue.shift()!;

    steps.push({
      current,
      visited: Array.from(visited),
      frontier: [...queue],
      traversedEdges: [...traversedEdges],
    });

    for (const neighbor of adjacency[current] ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        traversedEdges.push([current, neighbor]);

        steps.push({
          current,
          visited: Array.from(visited),
          frontier: [...queue],
          traversedEdges: [...traversedEdges],
        });
      }
    }
  }

  steps.push({
    current: null,
    visited: Array.from(visited),
    frontier: [],
    traversedEdges: [...traversedEdges],
  });

  return steps;
}

export function dfsSteps(
  adjacency: Record<number, number[]>,
  start: number
): TraversalStep[] {
  const visited = new Set<number>();
  const stack: number[] = [start];
  const steps: TraversalStep[] = [];
  const traversedEdges: Array<[number, number]> = [];

  steps.push({
    current: null,
    visited: [],
    frontier: [...stack],
    traversedEdges: [],
  });

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (visited.has(current)) {
      steps.push({
        current,
        visited: Array.from(visited),
        frontier: [...stack],
        traversedEdges: [...traversedEdges],
      });
      continue;
    }

    visited.add(current);

    steps.push({
      current,
      visited: Array.from(visited),
      frontier: [...stack],
      traversedEdges: [...traversedEdges],
    });

    const neighbors = [...(adjacency[current] ?? [])].reverse();

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        traversedEdges.push([current, neighbor]);

        steps.push({
          current,
          visited: Array.from(visited),
          frontier: [...stack],
          traversedEdges: [...traversedEdges],
        });
      }
    }
  }

  steps.push({
    current: null,
    visited: Array.from(visited),
    frontier: [],
    traversedEdges: [...traversedEdges],
  });

  return steps;
}
