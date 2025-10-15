'use client';

import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge, Connection, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';

export type RoadmapFlowProps = {
  lines: string[]; // list of roadmap items
  completedIds?: Set<number>; // indices (1-based) of completed items
  onToggleComplete?: (index: number) => void; // 0-based index
};

export function RoadmapFlow({ lines, completedIds, onToggleComplete }: RoadmapFlowProps) {
  const initialNodes: Node[] = useMemo(() => {
    return lines.map((text, idx) => ({
      id: `n${idx+1}`,
      position: { x: 100 + (idx % 2 === 0 ? 0 : 220), y: idx * 120 },
      data: { label: `${idx+1}. ${text}` },
      style: {
        borderRadius: 12,
        padding: 12,
        border: '1px solid hsl(var(--border))',
        background: (completedIds?.has(idx+1)) ? 'linear-gradient(135deg, #e8f5e9, #f1fff1)' : 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(6px)'
      }
    }));
  }, [lines, completedIds]);

  const initialEdges: Edge[] = useMemo(() => {
    const es: Edge[] = [];
    for (let i = 0; i < lines.length - 1; i++) {
      es.push({ id: `e${i}-${i+1}`, source: `n${i+1}`, target: `n${i+2}`, animated: true });
    }
    return es;
  }, [lines]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (connection: Connection) => setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
  const onNodeClick = (_: any, node: Node) => {
    if (!onToggleComplete) return;
    const idx = parseInt(node.id.replace('n',''), 10) - 1;
    if (!Number.isNaN(idx)) onToggleComplete(idx);
  };

  return (
    <div className="h-[600px] rounded-xl overflow-hidden border bg-white/60">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <MiniMap pannable zoomable />
        <Controls showInteractive />
        <Background gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}



