import React, { useCallback, useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
} from "reactflow";
import ZoomNode from "./ZoomNode";
import "reactflow/dist/style.css";
import "./index.css";
import { Slider } from "@mui/material";

const gridSnap = [20, 20];
const nodeTypeDefinitions = {
  zoom: ZoomNode,
};

const nodesInitialState = [
  {
    id: "1",
    type: "zoom",
    data: {
      content: (
        <div>
          <h4>Marvel Comics</h4>
          <p>
            Marvel Comics is an American comic book publisher
            and the property of The Walt Disney Company since
            December 31, 2009, and a subsidiary of Disney Publishing
            Worldwide since March 2023. Marvel was founded in 1939 by
            Martin Goodman as Timely Comics, and by 1951 had generally
            become known as Atlas Comics
          </p>
        </div>
      ),
      zoom: 1,
    },
    position: { x: 700, y: 250 },
  },
  {
    id: "2",
    type: "zoom",
    data: {
      content: (
        <div>
          <h4>Thor</h4>
          <p>
            The son of Odin uses his mighty abilities as
            the God of Thunder to protect his home Asgard
            and planet Earth alike.
          </p>
        </div>
      ),
      zoom: 1,
    },
    position: { x: 1200, y: 300 },
  },
  {
    id: "3",
    type: "zoom",
    data: {
      content: (
        <div>
          <h4>Black Panther</h4>
          <p>
            Black Panther is a 2018 American superhero film based on the Marvel
            Comics character of the same name. Produced by Marvel Studios and distributed
            by Walt Disney Studios Motion Pictures.
          </p>
        </div>
      ),
      zoom: 1,
    },
    position: { x: 180, y: 50 },
  },
  {
    id: "4",
    type: "zoom",
    data: {
      content: (
        <div>
          <h4>Captain America</h4>
          <p>
            Captain America is a superhero created by
            Joe Simon and Jack Kirby who appears in American
            comic books published by Marvel Comics.
          </p>
        </div>
      ),
      zoom: 1,
    },
    position: { x: 180, y: 500 },
  },
  {
    id: "5",
    type: "zoom",
    data: {
      content: (
        <div>
          <h4>Iron Man</h4>
          <p>
            Iron Man is a superhero appearing in American comic
            books published by Marvel Comics. Co-created by writer
            and editor Stan Lee, developed by scripter Larry Lieber,
            and designed by artists Don Heck and Jack Kirby,
          </p>
        </div>
      ),
      zoom: 1,
    },
    position: { x: 1200, y: 20 },
  },
  {
    id: "6",
    type: "zoom",
    data: {
      content: (
        <div>
          <h4>Hulk</h4>
          <p>
            The Hulk is a superhero appearing in American comic
            books published by Marvel Comics. Created by writer Stan
            Lee and artist Jack Kirby, the character first appeared in
            The Incredible Hulk.
          </p>
        </div>
      ),
      zoom: 1,
    },
    position: { x: 1200, y: 550 },
  },
];

const edgesInitialState = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "3", target: "1" },
  { id: "e1-4", source: "4", target: "1" },
  { id: "e1-5", source: "1", target: "5" },
  { id: "e1-6", source: "1", target: "6" },
];

const defaultView = { x: 0, y: 0, zoom: 1 };

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(nodesInitialState);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesInitialState);
  const [focusedNode, setFocusedNode] = useState(null);
  const [zoom, setZoom] = useState(1);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    []
  );

  const onNodeClick = (event, node) => {
    setFocusedNode(node.id);
    setZoom(node.data.zoom || 1);
  };

  const onZoomChange = (event) => {
    const newZoomLevel = parseFloat(event.target.value);
    setZoom(newZoomLevel);
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === focusedNode) {
          return {
            ...node,
            data: { ...node.data, zoom: newZoomLevel },
          };
        } else {
          const minimumZoom = 0.3;
          const zoomReductionFactor = 0.7;
          const adjustedZoom = Math.max(minimumZoom, 1 - (newZoomLevel - 1) * zoomReductionFactor);
          return {
            ...node,
            data: { ...node.data, zoom: adjustedZoom },
          };
        }
      })
    );
  };

  return (
    <div style={{ height: "100vh" }}>      
    <ReactFlow
      nodes={nodes.map((node) => ({
        ...node,
        data: { ...node.data, focused: node.id === focusedNode },
        style: {
          filter: zoom >= 2.7 && node.id !== focusedNode ? "blur(5px)" : "none",
          zIndex:"1"
        },
      }))}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypeDefinitions}
      snapToGrid={true}
      snapGrid={gridSnap}
      defaultViewport={defaultView}
      onNodeClick={onNodeClick}
      attributionPosition="top-right"
    >
      <Controls />
      <MiniMap />
      <Background variant="dots" gap={12} size={1} />
    </ReactFlow>
      {focusedNode && (
        <Slider
          className="horizontal-slider"
          sx={{ width: "20%", position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)" }}
          step={0.1}
          min={0.5}
          max={3}
          value={zoom}
          onChange={onZoomChange}
          valueLabelDisplay="auto"
          aria-label="Zoom Slider"
        />
      )}
    </div>
  );
};

export default App;
