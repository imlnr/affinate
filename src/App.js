import React, { useCallback, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import ReactSlider from 'react-slider';
import './App.css'; // Import necessary CSS for slider if required

const initialNodes = [
  { id: '1', position: { x: 750, y: 300 }, data: { label: <><h1>heading 1</h1><p>This is para 1</p></> }, type: 'custom' },
  { id: '2', position: { x: 200, y: 100 }, data: { label: <><h1>heading 2</h1><p>This is para 2</p></> }, type: 'custom' },
  { id: '3', position: { x: 200, y: 450 }, data: { label: <><h1>heading 3</h1><p>This is para 3</p></> }, type: 'custom' },
  { id: '4', position: { x: 1300, y: 60 }, data: { label: <><h1>heading 4</h1><p>This is para 4</p></> }, type: 'custom' },
  { id: '5', position: { x: 1300, y: 300 }, data: { label: <><h1>heading 5</h1><p>This is para 5</p></> }, type: 'custom' },
  { id: '6', position: { x: 1300, y: 600 }, data: { label: <><h1>heading 6</h1><p>This is para 6</p></> }, type: 'custom' }
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e1-4', source: '4', target: '1' },
  { id: 'e1-5', source: '5', target: '1' },
  { id: 'e1-6', source: '6', target: '1' }
];

const CustomNode = ({ data }) => {
  return (
    <div style={{ border: "1px solid", padding: "6px", borderRadius: "5px" }}>
      <Handle type="source" position={Position.Left} id="left" />
      {data.label}
      <Handle type="target" position={Position.Right} id="right" />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { setViewport, project, setCenter } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, sourceHandle: 'right', targetHandle: 'left' }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (event, node) => {
      setCenter(node.position.x, node.position.y, { zoom: 1.5, duration: 800 });
    },
    [setCenter]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
    >
      <Controls />
      <MiniMap />
      <Background variant="dots" gap={12} size={1} />
    </ReactFlow>
  );
}

export default function App() {
  const [zoom, setZoom] = useState(1);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Flow zoom={zoom} />
      {/* <ReactSlider
        className="horizontal-slider"
        thumbClassName="example-thumb"
        trackClassName="example-track"
        min={0.5}
        max={2}
        step={0.1}
        value={zoom}
        onChange={(value) => setZoom(value)}
        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
        }}
      /> */}
    </div>
  );
}
