import React from "react";
import { createRoot } from "react-dom/client";
import { Stage, Rect, Layer } from "react-konva";

const App = () => {
  const isDrawing = React.useRef(false);
  const [stageX, setStageX] = React.useState(0);
  const [stageY, setStageY] = React.useState(0);
  const [rectWidth, setRectWidth] = React.useState(0);
  const [rectHeight, setRectHeight] = React.useState(0);

  const handleMouseDown = (e) => {
    setStageX(0);
    setStageY(0);
    setRectWidth(0);
    setRectHeight(0);

    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setStageX(pos.x);
    setStageY(pos.y);
    console.log(pos);
  };

  const handlerMouseUp = (e) => {
    const pos = e.target.getStage().getPointerPosition();
    isDrawing.current = false;
    setRectWidth(pos.x - stageX);
    setRectHeight(pos.y - stageY);
    console.log(pos);
  };

  const handleOnMouseMove = (e) => {
    const pos = e.target.getStage().getPointerPosition();
    if (isDrawing.current) {
      setRectWidth(pos.x - stageX);
      setRectHeight(pos.y - stageY);

      console.log(pos);
    }
  };

  return (
    <div className="draw-component">
      <Stage
        width={window.innerWidth * 0.7}
        height={window.innerHeight * 0.6}
        onMouseMove={handleOnMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handlerMouseUp}
      >
        <Layer>
          <Rect
            width={rectWidth}
            height={rectHeight}
            x={stageX}
            y={stageY}
            stroke="black"
            strokeWidth={2}
            draggable
          />
        </Layer>
      </Stage>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
