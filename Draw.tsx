import React, {useState, useRef} from "react"
import {Stage, Layer, Rect, Group} from "react-konva"

import "./Draw.css"




const DrawGraphComponent:React.FunctionComponent<{}> = (props) => {
    const isDrawing = useRef(false)
    const [stageX, setStageX] = useState(0)
    const [stageY, setStageY] = useState(0)
    const [rectWidth, setRectWidth] = useState(0)
    const [rectHeight, setRectHeight] = useState(0)

    const handleMouseDown = (e: any) => {
        setStageX(0)
        setStageY(0)
        setRectWidth(0)
        setRectHeight(0)

        isDrawing.current = true
        const pos = e.target.getStage().getPointerPosition()
        setStageX(pos.x)
        setStageY(pos.y)
        console.log(pos)
    }

    const handlerMouseUp = (e: any) => {
        const pos = e.target.getStage().getPointerPosition()
        isDrawing.current = false
        setRectWidth(pos.x - stageX)
        setRectHeight(pos.y - stageY)
        console.log(pos)
    }

    const handleOnMouseMove = (e:any) => {
        const pos =e.target.getStage().getPointerPosition()
        if(isDrawing.current) {
            setRectWidth(pos.x - stageX)
            setRectHeight(pos.y - stageY)

            console.log(pos)
        }

    }

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

    )
}


export default DrawGraphComponent