export type TraversalAlgorithm = "bfs" | "dfs";

export type GraphNode = {
  id: number;
  x: number;
  y: number;
};

export type GraphEdge = {
  source: number;
  target: number;
};

export type TraversalStep = {
  current: number | null;
  visited: number[];
  frontier: number[];
  traversedEdges?: Array<[number, number]>;
};

export type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  adjacency: Record<number, number[]>;
};
