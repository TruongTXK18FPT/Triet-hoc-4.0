'use client';

import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge, Connection, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';

export type RoadmapFlowProps = {
  lines: string[]; // list of roadmap items
  completedIds?: Set<number>; // indices (1-based) of completed items
  onToggleComplete?: (index: number) => void; // 0-based index
};

// Helper to clean and format text
function cleanText(text: string): string {
  return text
    .replace(/^\d+\)\s*/, '') // Remove leading numbers like "1) "
    .replace(/\*\*/g, '') // Remove markdown bold
    .replace(/\*/g, '') // Remove markdown italic
    .replace(/—.*$/, '') // Remove everything after — (description)
    .trim();
}

export function RoadmapFlow({ lines, completedIds, onToggleComplete }: RoadmapFlowProps) {
  const initialNodes: Node[] = useMemo(() => {
    return lines.map((text, idx) => {
      const cleanedText = cleanText(text);
      const isCompleted = completedIds?.has(idx+1);
      
      return {
        id: `n${idx+1}`,
        position: { x: 100 + (idx % 3) * 280, y: Math.floor(idx / 3) * 150 },
        data: { label: `${idx+1}. ${cleanedText.substring(0, 50)}${cleanedText.length > 50 ? '...' : ''}` },
        style: {
          borderRadius: 16,
          padding: 16,
          border: isCompleted ? '3px solid #10b981' : '2px solid #f59e0b',
          background: isCompleted 
            ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' 
            : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          backdropFilter: 'blur(8px)',
          boxShadow: isCompleted 
            ? '0 4px 12px rgba(16, 185, 129, 0.3)' 
            : '0 4px 12px rgba(245, 158, 11, 0.3)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontSize: '14px',
          fontWeight: '600',
          color: isCompleted ? '#065f46' : '#92400e',
          minWidth: '220px',
          maxWidth: '240px',
        }
      };
    });
  }, [lines, completedIds]);

  const initialEdges: Edge[] = useMemo(() => {
    const es: Edge[] = [];
    for (let i = 0; i < lines.length - 1; i++) {
      const isCompleted = completedIds?.has(i+1) && completedIds?.has(i+2);
      es.push({ 
        id: `e${i}-${i+1}`, 
        source: `n${i+1}`, 
        target: `n${i+2}`, 
        animated: true,
        style: {
          stroke: isCompleted ? '#10b981' : '#f59e0b',
          strokeWidth: 2,
        },
        type: 'smoothstep',
      });
    }
    return es;
  }, [lines, completedIds]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (connection: Connection) => setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
  const onNodeClick = (_: any, node: Node) => {
    if (!onToggleComplete) return;
    const idx = parseInt(node.id.replace('n',''), 10) - 1;
    if (!Number.isNaN(idx)) onToggleComplete(idx);
  };

  return (
    <div className="h-[600px] rounded-2xl overflow-hidden border-2 border-amber-200 bg-gradient-to-br from-slate-50 to-amber-50 shadow-xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <MiniMap 
          pannable 
          zoomable 
          nodeColor={(node) => {
            const idx = parseInt(node.id.replace('n',''), 10);
            return completedIds?.has(idx) ? '#10b981' : '#f59e0b';
          }}
          className="!bg-white/90 !border-2 !border-amber-200"
        />
        <Controls 
          showInteractive 
          className="!bg-white/90 !border-2 !border-amber-200 !rounded-xl"
        />
        <Background 
          gap={20} 
          size={1.5} 
          color="#f59e0b"
          className="opacity-20"
        />
      </ReactFlow>
    </div>
  );
}



