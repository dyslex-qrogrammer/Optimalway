import { GraphData, GraphEdge, GraphNode } from "./types";

export function createSampleGraph(nodeCount: number = 8): GraphData {
  // 1) Make nodes arranged in a circle so they don't overlap much
  const centerX = 350;
  const centerY = 235;
  const radius = 170;

  const nodes: GraphNode[] = Array.from({ length: nodeCount }, (_, id) => {
    const angle = (2 * Math.PI * id) / nodeCount;
    return {
      id,
      x: Math.round(centerX + radius * Math.cos(angle)),
      y: Math.round(centerY + radius * Math.sin(angle)),
    };
  });

  // 2) Build edges:
  // - connect i -> i+1 (cycle) so graph is always connected
  // - add extra "chord" edges to make traversal interesting
  const edges: GraphEdge[] = [];

  // cycle edges
  for (let i = 0; i < nodeCount; i++) {
    edges.push({ source: i, target: (i + 1) % nodeCount });
  }

  // extra edges (chords)
  const jump = Math.max(2, Math.floor(nodeCount / 3));
  for (let i = 0; i < nodeCount; i++) {
    const j = (i + jump) % nodeCount;
    if (i !== j) edges.push({ source: i, target: j });
  }

  return {
    nodes,
    edges,
    adjacency: buildAdjacency(nodes, edges),
  };
}

export function buildAdjacency(
  nodes: GraphNode[],
  edges: GraphEdge[]
): Record<number, number[]> {
  const adjacency: Record<number, number[]> = {};

  for (const node of nodes) {
    adjacency[node.id] = [];
  }

  for (const edge of edges) {
    adjacency[edge.source].push(edge.target);
    adjacency[edge.target].push(edge.source);
  }

  for (const key of Object.keys(adjacency)) {
    adjacency[Number(key)].sort((a, b) => a - b);
  }

  return adjacency;
}
