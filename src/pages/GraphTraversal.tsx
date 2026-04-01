import GraphTraversalVisualizer from "../sections/GraphTraversal/GraphTraversalVisualizer";

export default function GraphTraversal() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Graph Traversal</h1>
          <p className="mt-3 max-w-3xl text-base opacity-80">
            Explore how breadth-first search and depth-first search visit nodes in
            a graph. Generate a sample graph, choose a starting node, and step
            through the traversal visually.
          </p>
        </div>

        <GraphTraversalVisualizer />
      </div>
    </main>
  );
}
