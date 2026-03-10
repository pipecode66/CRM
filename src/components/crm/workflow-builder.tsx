"use client";

import "reactflow/dist/style.css";

import { useMemo } from "react";
import ReactFlow, { Background, Controls, MiniMap, type Edge, type Node } from "reactflow";

type BuilderProps = {
  workflowName: string;
  nodes?: Node[];
  edges?: Edge[];
};

const defaultNodes: Node[] = [
  {
    id: "trigger-1",
    position: { x: 20, y: 60 },
    data: { label: "Trigger: message.received" },
    type: "input",
  },
  {
    id: "action-1",
    position: { x: 290, y: 60 },
    data: { label: "Action: ai.invoke" },
  },
  {
    id: "action-2",
    position: { x: 560, y: 60 },
    data: { label: "Action: message.reply" },
    type: "output",
  },
];

const defaultEdges: Edge[] = [
  { id: "e1-2", source: "trigger-1", target: "action-1", label: "on message" },
  { id: "e2-3", source: "action-1", target: "action-2", label: "if confidence > 0.8" },
];

export function WorkflowBuilder({ workflowName, nodes, edges }: BuilderProps) {
  const flowNodes = useMemo(() => nodes ?? defaultNodes, [nodes]);
  const flowEdges = useMemo(() => edges ?? defaultEdges, [edges]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-900">{workflowName}</h3>
        <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">DSL v1</span>
      </header>

      <div className="h-[520px] overflow-hidden rounded-xl border border-slate-200">
        <ReactFlow nodes={flowNodes} edges={flowEdges} fitView>
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </section>
  );
}
