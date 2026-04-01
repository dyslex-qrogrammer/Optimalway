export type Tile = {
  id: string;
  title: string;
  subtitle?: string;
  path: string;
};

export const TILES: Tile[] = [
  { id: "sorting",   title: "Sorting",   subtitle: "Bars, swaps, stability", path: "/sorting" },
  { id: "searching", title: "Searching", subtitle: "Comparisons & decisions", path: "/searching" },
  { id: "road",      title: "Road Routing", subtitle: "Weighted shortest path", path: "/road-routing" },

  { id: "graph-traversal", title: "Graph Traversal", subtitle: "BFS vs DFS", path: "/graph-traversal" },
];
