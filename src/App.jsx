import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from 'reactflow';

import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 750, y: 300 }, data: { label: <><h1>heading 1</h1><p>This is para 1</p></> }, type: 'custom' },
  { id: '2', position: { x: 200, y: 100 }, data: { label: <><h1>heading 2</h1><p>This is para 2</p></> }, type: 'custom' },
  { id: '3', position: { x: 200, y: 450 }, data: { label: <><h1>heading 3</h1><p>This is para 3</p></> }, type: 'custom' },
  { id: '4', position: { x: 1300, y: 60 }, data: { label: <><h1>heading 4</h1><p>This is para 4</p></> }, type: 'custom' },
  { id: '5', position: { x: 1300, y: 300 }, data: { label: <><h1>heading 5</h1><p>This is para 5</p></> }, type: 'custom' },
  { id: '6', position: { x: 1300, y: 600 }, data: { label: <><h1>heading 6</h1><p>This is para 6</p></> }, type: 'custom' }
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' },{ id: 'e1-3', source: '1', target: '3' },{ id: 'e1-4', source: '4', target: '1' },{ id: 'e1-5', source: '5', target: '1' },{ id: 'e1-6', source: '6', target: '1' }];

const CustomNode = ({ data }) => {
  return (
    <div style={{border:"1px solid",padding:"6px",borderRadius:"5px"}}>
      <Handle type="source" position={Position.Left} id="left" />
      {data.label}
      <Handle type="target" position={Position.Right} id="right" />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, sourceHandle: 'right', targetHandle: 'left' }, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
