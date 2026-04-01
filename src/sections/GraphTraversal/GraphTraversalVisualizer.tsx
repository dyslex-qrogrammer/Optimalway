import { useEffect, useMemo, useRef, useState } from "react";
import { bfsSteps, dfsSteps } from "./algorithms";
import { createSampleGraph } from "./graphUtils";
import { GraphData, TraversalAlgorithm, TraversalStep } from "./types";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const graphFactory = () => createSampleGraph();

const algorithmOptions: { key: TraversalAlgorithm; label: string }[] = [
  { key: "bfs", label: "Breadth-First Search" },
  { key: "dfs", label: "Depth-First Search" },
];

export default function GraphTraversalVisualizer() {
  const [graph, setGraph] = useState<GraphData>(graphFactory);
  const [algorithm, setAlgorithm] = useState<TraversalAlgorithm>("bfs");
  const [startNode, setStartNode] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(700);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const cancelRef = useRef(false);

  const steps = useMemo<TraversalStep[]>(() => {
    return algorithm === "bfs"
      ? bfsSteps(graph.adjacency, startNode)
      : dfsSteps(graph.adjacency, startNode);
  }, [graph, algorithm, startNode]);

  const currentStep = steps[currentStepIndex] ?? steps[0];

  useEffect(() => {
    setIsFinished(currentStepIndex >= steps.length - 1);
  }, [currentStepIndex, steps.length]);

  useEffect(() => {
    cancelRef.current = false;

    async function run() {
      if (!isRunning) return;

      for (let i = currentStepIndex + 1; i < steps.length; i++) {
        if (cancelRef.current) return;
        await sleep(speed);
        setCurrentStepIndex(i);
      }

      setIsRunning(false);
    }

    run();

    return () => {
      cancelRef.current = true;
    };
  }, [isRunning, currentStepIndex, steps, speed]);

  function resetTraversal() {
    cancelRef.current = true;
    setIsRunning(false);
    setCurrentStepIndex(0);
    setIsFinished(false);
  }

  function regenerateGraph() {
    cancelRef.current = true;
    setIsRunning(false);
    const next = graphFactory();
    setGraph(next);
    setStartNode(next.nodes[0]?.id ?? 0);
    setCurrentStepIndex(0);
    setIsFinished(false);
  }

  function toggleRun() {
    if (isFinished) {
      resetTraversal();
      setTimeout(() => setIsRunning(true), 0);
      return;
    }

    setIsRunning((prev) => !prev);
  }

  function isEdgeTraversed(source: number, target: number) {
    return currentStep?.traversedEdges?.some(
      ([a, b]) =>
        (a === source && b === target) || (a === target && b === source)
    );
  }

  function isVisited(nodeId: number) {
    return currentStep?.visited.includes(nodeId);
  }

  function isCurrent(nodeId: number) {
    return currentStep?.current === nodeId;
  }

  function isFrontier(nodeId: number) {
    return currentStep?.frontier.includes(nodeId);
  }

  return (
    <section className="space-y-6 rounded-2xl border p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Algorithm</span>
            <select
              value={algorithm}
              onChange={(e) => {
                setAlgorithm(e.target.value as TraversalAlgorithm);
                resetTraversal();
              }}
              className="rounded-xl border px-3 py-2"
            >
              {algorithmOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Start Node</span>
            <select
              value={startNode}
              onChange={(e) => {
                setStartNode(Number(e.target.value));
                resetTraversal();
              }}
              className="rounded-xl border px-3 py-2"
            >
              {graph.nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  Node {node.id}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Speed: {speed} ms</span>
            <input
              type="range"
              min={200}
              max={1500}
              step={100}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">
              Step: {currentStepIndex + 1} / {steps.length}
            </span>
            <input
              type="range"
              min={0}
              max={Math.max(steps.length - 1, 0)}
              value={currentStepIndex}
              onChange={(e) => {
                cancelRef.current = true;
                setIsRunning(false);
                setCurrentStepIndex(Number(e.target.value));
              }}
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={toggleRun}
            className="rounded-xl border px-4 py-2 font-medium"
          >
            {isRunning ? "Pause" : isFinished ? "Replay" : "Start"}
          </button>

          <button
            onClick={resetTraversal}
            className="rounded-xl border px-4 py-2 font-medium"
          >
            Reset
          </button>

          <button
            onClick={regenerateGraph}
            className="rounded-xl border px-4 py-2 font-medium"
          >
            Regenerate
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-slate-400" />
          <span>Unvisited</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-amber-500" />
          <span>Frontier</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-sky-500" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          <span>Visited</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border p-4">
        <svg viewBox="0 0 700 470" className="h-[470px] w-full">
          {graph.edges.map((edge) => {
            const source = graph.nodes.find((node) => node.id === edge.source)!;
            const target = graph.nodes.find((node) => node.id === edge.target)!;
            const traversed = isEdgeTraversed(edge.source, edge.target);

            return (
              <line
                key={`${edge.source}-${edge.target}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={traversed ? "currentColor" : "currentColor"}
                strokeOpacity={traversed ? 0.95 : 0.25}
                strokeWidth={traversed ? 4 : 2}
                className={traversed ? "text-emerald-500" : "text-slate-500"}
              />
            );
          })}

          {graph.nodes.map((node) => {
            let fillClass = "fill-slate-400";

            if (isVisited(node.id)) fillClass = "fill-emerald-500";
            if (isFrontier(node.id)) fillClass = "fill-amber-500";
            if (isCurrent(node.id)) fillClass = "fill-sky-500";

            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={28}
                  className={`${fillClass} transition-all duration-300`}
                />
                <text
                  x={node.x}
                  y={node.y + 6}
                  textAnchor="middle"
                  className="fill-white text-sm font-bold"
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border p-4">
          <h2 className="mb-3 text-lg font-semibold">
            {algorithm === "bfs" ? "Queue State" : "Stack State"}
          </h2>
          <div className="flex min-h-[72px] flex-wrap gap-2">
            {currentStep?.frontier.length ? (
              currentStep.frontier.map((value, index) => (
                <div
                  key={`${value}-${index}`}
                  className="rounded-xl border px-4 py-2 text-sm font-medium"
                >
                  {value}
                </div>
              ))
            ) : (
              <p className="text-sm opacity-70">Empty</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border p-4">
          <h2 className="mb-3 text-lg font-semibold">Visited Order</h2>
          <div className="flex min-h-[72px] flex-wrap gap-2">
            {currentStep?.visited.length ? (
              currentStep.visited.map((value, index) => (
                <div
                  key={`${value}-${index}`}
                  className="rounded-xl border px-4 py-2 text-sm font-medium"
                >
                  {index + 1}. {value}
                </div>
              ))
            ) : (
              <p className="text-sm opacity-70">None yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-4 text-sm leading-6">
        <strong className="mb-2 block">
          {algorithm === "bfs"
            ? "Breadth-First Search"
            : "Depth-First Search"}
        </strong>

        {algorithm === "bfs" ? (
          <p>
            BFS explores the graph level by level. It uses a queue, so nodes
            discovered earlier are processed first. This makes it useful for
            finding the shortest path in an unweighted graph.
          </p>
        ) : (
          <p>
            DFS explores as deep as possible before backtracking. It uses a stack
            or recursion, which makes it useful for traversal, connectivity,
            cycle checks, and many graph-based problems.
          </p>
        )}
      </div>
    </section>
  );
}
