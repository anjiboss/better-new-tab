import React from "react";
import { Layer, Stage } from "react-konva";
import { IStick } from "../types/types";
import Stick from "./Stick";

interface DesktopCanvasProps {
  children?: React.ReactNode;
  sticks: IStick[];
}

const DesktopCanvas: React.FC<DesktopCanvasProps> = ({ sticks }) => {
  return (
    <>
      <Stage
        width={700}
        height={700}
        style={{
          border: "1px solid black",
        }}
      >
        <Layer>
          {sticks.map((stick) => (
            <Stick key={stick.id} stick={stick} />
          ))}
        </Layer>
      </Stage>
    </>
  );
};
export default DesktopCanvas;
