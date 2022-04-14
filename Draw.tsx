import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import { Stage, Rect, Layer } from "react-konva";

const App = () => {
  const [shouldDraw, setShouldDraw] = React.useState(false);
  // const [isDrawing, setIsDrawing] = React.useState(false);
  const isDrawing = useRef(false);
  const [stageX, setStageX] = React.useState(0);
  const [stageY, setStageY] = React.useState(0);
  const [rectWidth, setRectWidth] = React.useState(0);
  const [rectHeight, setRectHeight] = React.useState(0);

  const handleMouseDown = (e) => {
    if (shouldDraw) {
      setStageX(0);
      setStageY(0);
      setRectWidth(0);
      setRectHeight(0);

      isDrawing.current = true;
      // setIsDrawing(true);
      const pos = e.target.getStage().getPointerPosition();
      setStageX(pos.x);
      setStageY(pos.y);
      console.log(pos);
    }
  };

  const handlerMouseUp = (e) => {
    if (shouldDraw) {
      const pos = e.target.getStage().getPointerPosition();
      isDrawing.current = false;
      // setIsDrawing(false);
      setRectWidth(pos.x - stageX);
      setRectHeight(pos.y - stageY);
      console.log(pos);
    }
  };

  const handleOnMouseMove = (e) => {
    if (shouldDraw) {
      const pos = e.target.getStage().getPointerPosition();
      if (isDrawing.current) {
        setRectWidth(pos.x - stageX);
        setRectHeight(pos.y - stageY);

        console.log(pos);
      }
    }
  };

  const onButtonClick = () => {
    setShouldDraw(true);
  };

  const onStopDraw = () => {
    setShouldDraw(false);
  };
  return (
    <div style={{ height: 500, width: 500, border: "2px, solid, black" }}>
      <Stage
        width={300}
        height={300}
        style={{ background: "aqua" }}
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
      <button style={{ height: 35, width: 80 }} onClick={onButtonClick}>
        Draw
      </button>
      <button style={{ height: 35, width: 80 }} onClick={onStopDraw}>
        Stop Draw
      </button>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
