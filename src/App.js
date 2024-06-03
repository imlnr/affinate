import React, { useCallback, useEffect, useState } from 'react';
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
  useStore,
} from 'reactflow';
import 'reactflow/dist/style.css';
import ReactSlider from 'react-slider';
import './App.css'; // Import necessary CSS for slider if required
import { Slider } from '@mui/material';

function formatTextToSixWordsPerLine(text) {
  const words = text.split(' ');
  let formattedText = '';
  for (let i = 0; i < words.length; i++) {
    formattedText += words[i] + ' ';
    if ((i + 1) % 6 === 0) {
      formattedText += '<br>';
    }
  }
  return formattedText.trim();
}

const initialText = [
  "React Flow is a library for building node-based applications. These can be anything from simple static diagrams to data visualisations to complex visual editors. You can implement custom node types and edges and it comes with components like a minimap and viewport controls out of the box",
  "Sliders reflect a range of values along a bar, from which users may select a single value. They are ideal for adjusting settings such as volume, brightness, or applying image filters"
];

const initialNodes = [
  {
    id: '1',
    position: { x: 750, y: 300 },
    data: {
      label: { __html: `<h1>heading 1</h1><p>${formatTextToSixWordsPerLine(initialText[0])}</p><p>${formatTextToSixWordsPerLine(initialText[1])}</p>` },
    },
    type: 'custom',
  },
  {
    id: '2',
    position: { x: 200, y: 100 },
    data: {
      label: { __html: `<h1>heading 2</h1><p>${formatTextToSixWordsPerLine(initialText[0])}</p><p>${formatTextToSixWordsPerLine(initialText[1])}</p>` },
    },
    type: 'custom',
  },
  {
    id: '3',
    position: { x: 200, y: 450 },
    data: {
      label: { __html: `<h1>heading 3</h1><p>${formatTextToSixWordsPerLine(initialText[0])}</p><p>${formatTextToSixWordsPerLine(initialText[1])}</p>` },
    },
    type: 'custom',
  },
  {
    id: '4',
    position: { x: 1300, y: -50 },
    data: {
      label: { __html: `<h1>heading 4</h1><p>${formatTextToSixWordsPerLine(initialText[0])}</p><p>${formatTextToSixWordsPerLine(initialText[1])}</p>` },
    },
    type: 'custom',
  },
  {
    id: '5',
    position: { x: 1300, y: 300 },
    data: {
      label: { __html: `<h1>heading 5</h1><p>${formatTextToSixWordsPerLine(initialText[0])}</p><p>${formatTextToSixWordsPerLine(initialText[1])}</p>` },
    },
    type: 'custom',
  },
  {
    id: '6',
    position: { x: 1300, y: 650 },
    data: {
      label: { __html: `<h1>heading 6</h1><p>${formatTextToSixWordsPerLine(initialText[0])}</p><p>${formatTextToSixWordsPerLine(initialText[1])}</p>` },
    },
    type: 'custom',
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e1-4', source: '4', target: '1' },
  { id: 'e1-5', source: '5', target: '1' },
  { id: 'e1-6', source: '6', target: '1' },
];
const snapGrid = [20, 20];

const Placeholder = () => (
  <div className="placeholder">
    <div />
    <div />
    <div />
  </div>
);

const zoomSelector = (s) => s.transform[2] >= 1;

const CustomNode = ({ data }) => {
  const showContent = useStore(zoomSelector);
  return (
    <div style={{ border: '1px solid', padding: '6px', borderRadius: '5px' }}>
      <Handle type="source" position={Position.Left} id="left" />
      {showContent ? <div dangerouslySetInnerHTML={data.label} /> : <Placeholder />}
      <Handle type="target" position={Position.Right} id="right" />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

function Flow({ zoom }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { setCenter, zoomTo, fitView } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, sourceHandle: 'right', targetHandle: 'left' }, eds)
      ),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (event, node) => {
      setSelectedNode(node.id);
      setCenter(node.position.x, node.position.y, { zoom: 2, duration: 1000 });
    },
    [setCenter]
  );

  useEffect(() => {
    if (selectedNode) {
      const node = nodes.find(n => n.id === selectedNode);
      if (node) {
        setCenter(node.position.x, node.position.y, { zoom, duration: 1000 });
      }
    } else {
      fitView({ duration: 1000 });
    }
  }, [zoom, selectedNode, setCenter, fitView, nodes]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id !== selectedNode) {
          const paragraphs = node.data.label.__html.split('</p>');
          const visibleParagraphs = Math.max(1, Math.floor((zoom - 0.5) * 2));
          const newLabel = paragraphs.slice(0, visibleParagraphs).join('</p>') + '</p>';
          return {
            ...node,
            data: {
              ...node.data,
              label: { __html: newLabel },
            },
          };
        }
        return node;
      })
    );
  }, [zoom, selectedNode, setNodes]);

  return (
    <ReactFlow
      nodes={nodes.map(node => ({
        ...node,
        style: node.id === selectedNode ? { border: "2px solid black", borderRadius: "7px" } : { border: '1px solid black', borderRadius: "7px" }
      }))}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      snapGrid={snapGrid}
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
  const [zoom, setZoom] = useState(0.5);

  return (
    <ReactFlowProvider>
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <Flow zoom={zoom} />
        <Slider
          className="horizontal-slider"
          sx={{ width: "20%", position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }}
          step={0.1}
          min={0.5}
          max={2}
          defaultValue={zoom}
          onChange={(event, value) => setZoom(value)}
          valueLabelDisplay='auto'
          aria-label="Zoom Slider"
        />
      </div>
    </ReactFlowProvider>
  );
}
