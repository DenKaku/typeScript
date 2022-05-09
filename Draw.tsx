
import Konva from "konva"
import React, {useState, useEffect, useRef, createRef, HtmlHTMLAttributes} from "react"

import {Stage, Layer, Rect, Transformer} from "react-konva"

import $ from "jquery"
import "jquery-ui"

import "./Draw.css"


const Rectangle:React.FunctionComponent<{shapeProps:any, isSelected:any, onSelect:Function, onChange:Function}> = (props) => {
    const shapeRef = useRef<Konva.Rect>(null)
    const trRef = useRef<Konva.Transformer>(null)


    const [trX, setTrx] = useState(0)
    const [trY, setTrY] = useState(0)
    const [trW, setTrW] = useState(0)
    const [trH, setTrH] = useState(0)

    useEffect(() => {
        console.log("###", shapeRef.current)
        // trRef.current = shapeRef.current
        console.log("###ddd", props.isSelected)
        if(props.isSelected && shapeRef.current ) {
            console.log()
            trRef.current?.nodes([shapeRef.current])
            trRef.current?.getLayer()?.batchDraw()
        }

    },[props.isSelected])


    return (
        <React.Fragment>
            <Rect
                onClick={props.onSelect}
                onTap={props.onSelect}
                stroke={'black'}
                ref={shapeRef}
                {...props.shapeProps}
                draggable
                onDragEnd={(e)=> {
                    props.onChange({
                        ...props.shapeProps,
                        x: e.target.x(),
                        y: e.target.y()
                    })
                }}

                onTransformEnd={(e) => {
                    const node = shapeRef.current;
                    const scaleX = node?.scaleX();
                    const scaleY = node?.scaleY();
                    const X = node?.x();
                    const Y = node?.y();

                    console.log("scaleX", scaleX)
                    console.log("scaleY", scaleY)
                    console.log("node", node)


                }}
            />
            {props.isSelected && (
                <Transformer
                    ref={trRef}

                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                          return oldBox;
                        }
                        return newBox;
                      }}

                />
            )
            }
        </React.Fragment>
    )
}


const DrawGraphComponent:React.FunctionComponent<{}> = (props) => {
    const isDrawing = useRef(false)
    const [stageX, setStageX] = useState(0)
    const [stageY, setStageY] = useState(0)
    const [rectWidth, setRectWidth] = useState(0)
    const [rectHeight, setRectHeight] = useState(0)
    const [shouldDraw, setShouldDraw] = useState(false)
    const [selecedtId, setSelectedId] = useState("")
    const [stageScale, setStageScale] = useState(1)
    const [x, setX] = useState(0)
    const [y, setY] = useState(0)

    const StageRef = useRef<Konva.Stage>(null)

    const handleMouseDown = (e: any) => {
        if(shouldDraw) {
            setStageX(0)
            setStageY(0)
            setRectWidth(0)
            setRectHeight(0)

            // console.log("Stage ref", StageRef.current)
            // const node = StageRef.current
            // console.log(node?.getPointerPosition())

            isDrawing.current = true
            // const pos = e.target.getStage().getPointerPosition()

            const pos = e.target.getStage().getRelativePointerPosition()

            console.log("abs", e.target.getStage().getPointerPosition())
            console.log("relative", e.target.getStage().getRelativePointerPosition())

            setStageX(pos.x)
            setStageY(pos.y)

            // if(StageRef.current) {
            //     if(null !== node) {
            //         if( null !== node.getRelativePointerPosition()) {
            //             const absPos = node.getRelativePointerPosition()


            //             if(null !== absPos  ) {
            //                  const x:number = absPos.x

            //                  const y:number = absPos.y
            //                 console.log("xxxx", x)
            //                 console.log("yyyy", y)

            //                 setStageX(x)
            //                 setStageY(y)
            //             }
            //         }
            //     }
            // }
        }

        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            setSelectedId("");
        }

    }

    const handlerMouseUp = (e: any) => {
        if(shouldDraw) {
            // const pos = e.target.getStage().getPointerPosition()
            const pos = e.target.getStage().getRelativePointerPosition()
            isDrawing.current = false
            setRectWidth(pos.x - stageX)
            setRectHeight(pos.y - stageY)

            // const node = StageRef.current
            // if(StageRef.current) {
            //     if(null !== node) {
            //         if( null !== node.getRelativePointerPosition()) {
            //             const absPos = node.getRelativePointerPosition()


            //             if(null !== absPos  ) {
            //                  const x:number = absPos.x

            //                  const y:number = absPos.y

            //                  setRectWidth(x - stageX)
            //                  setRectHeight(y - stageY)
            //             }

            //         }
            //     }

            // }



        }
    }

    const handleOnMouseMove = (e:any) => {
        if(shouldDraw) {
            // const pos =e.target.getStage().getPointerPosition()
            // const node = StageRef.current

            const pos = e.target.getStage().getRelativePointerPosition()


            if(isDrawing.current) {
                setRectWidth(pos.x - stageX)
                setRectHeight(pos.y - stageY)

                // if(null !== node) {
                //     if( null !== node.getRelativePointerPosition()) {
                //         const absPos = node.getRelativePointerPosition()


                //         if(null !== absPos  ) {
                //              const x:number = absPos.x

                //              const y:number = absPos.y

                //             console.log("on mouse move")
                //             setRectWidth(x - stageX)
                //             setRectHeight(y - stageY)
                //         }

                //     }
                // }
            }
        }
    }

    const onButtonClick = () => {
        setShouldDraw(true)
    }

    const onStopDraw = () => {
        setShouldDraw(false)
    }

    const onMouseWheel = (e: { evt: { preventDefault: () => void; deltaY: number }; target: { getStage: () => any } }) => {
        e.evt.preventDefault();
        let stage = e.target.getStage()
        var oldScale = stage.scaleX();

        var scaleBy = 0.9

        var mousePointTo = {
          x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
          y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
        };

        var newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        stage.scale({ x: newScale, y: newScale });

        setStageScale(newScale)

        var newPos = {
          x:
            -(mousePointTo.x - stage.getPointerPosition().x / newScale) *
            newScale,
          y:
            -(mousePointTo.y - stage.getPointerPosition().y / newScale) *
            newScale
        };

        setX(-(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale)
        setY(-(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale)

        stage.position(newPos);
        stage.batchDraw();
    }

    const p = {
        x: 20,
        y: 20,
        width: 100,
        height: 100,
        id: 'rect1',
    }

    return (
        <div className="draw-component">
            <Stage
                ref={StageRef}
                width={window.innerWidth * 0.7}
                height={window.innerHeight * 0.6}
                onMouseMove={handleOnMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handlerMouseUp}
                onWheel={onMouseWheel}
                scaleX={stageScale}
                scaleY={stageScale}
                x={x}
                y={y}
            >
                <Layer id="#layer1">
                    <Rect
                        width={rectWidth}
                        height={rectHeight}
                        x={stageX}
                        y={stageY}
                        stroke="black"
                        strokeWidth={2}
                        draggable
                    />
                    {/* <Rectangle
                        shapeProps={p}
                        isSelected={p.id === selecedtId}
                        onSelect={() => {
                            console.log("selected")
                            setSelectedId(p.id)
                        }}
                        onChange={() => {}}
                    /> */}
                    {/* <Rect
                        id={"rect1"}
                        x={50}
                        y={50}
                        width={200}
                        height={200}
                        stroke={"black"}
                        fill={"blue"}
                        strokeWidth={2}
                        onTransform={() => {}}
                        onClick={() => {
                            console.log($("#layer1"))
                        }}
                    />
                    <Transformer
                        boundBoxFunc={(oldBox, newBox) => {
                            // limit resize
                            if (newBox.width < 5 || newBox.height < 5) {
                              return oldBox;
                            }
                            return newBox;
                        }}
                    /> */}

                </Layer>
            </Stage>
            <button style={{"width": "80px", "height": "35"}} onClick={onButtonClick}> Draw </button>
            <button style={{"width": "80px", "height": "35"}} onClick={onStopDraw}> Stop Draw </button>
        </div>

    )
}


export default DrawGraphComponent
