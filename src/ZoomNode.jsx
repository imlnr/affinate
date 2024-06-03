import React, { memo } from "react";
import { Handle, Position } from "reactflow";

const ZoomNode = ({ id, data }) => {
  const { zoom = 1, focused, content } = data;
  const isMinimized = zoom < 0.8;
  const borderColor = focused ? "blue" : "black";

  return (
    <div
      style={{
        transform: `scale(${zoom})`,
        padding: 10,
        border: `2px solid ${borderColor}`,
        backgroundColor: "white",
        borderRadius: 20,
        width: 250,
        overflow: "hidden",
      }}
    >
      <Handle type="target" position={Position.Left} />
      {isMinimized ? (
        <h4>{content.props.children[0].props.children}</h4>
      ) : (
        content
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(ZoomNode);
