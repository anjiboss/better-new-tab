import React, {
  CSSProperties,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import AppContext from "../context/AppContext";
import { IStick } from "../types/types";
import { getIcon, isURL } from "../ultis/utils";
import { toasti } from "../ultis/_visual";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

interface StickProps {
  children?: React.ReactNode;
  stick: IStick;
  selected: IStick[];
  select: (stick: IStick, isMultiple: boolean) => void;
  unselect: (stick: IStick) => void;
}

const stickStyle: CSSProperties = {
  // height: 50,
  width: "fit-content",
  maxWidth: 100,
  blockSize: "fit-content",
  padding: "3px 5px",
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
};

const Stick: React.FC<StickProps> = ({ stick }) => {
  const { insertOrUpdateAndSave } = useContext(AppContext);
  const icon = useRef<HTMLImageElement>(null);

  // TODO Add Selecting in future
  // const isSelected = useMemo(() => {
  //   return selected.find((_s) => _s.id === stick.id) ? true : false;
  // }, [selected]);

  const handleDragStop = (_: DraggableEvent, data: DraggableData) => {
    insertOrUpdateAndSave({
      ...stick,
      ...{ position: { x: data.x, y: data.y } },
    });
  };
  const isUrlValid = useMemo(() => {
    return isURL(stick.url);
  }, [stick.url]);

  useEffect(() => {
    if (icon.current) {
      if (stick.icon.isCached) {
        icon.current.src = stick.icon.base64;
      } else {
        getIcon(stick).then((base64) => {
          if (base64) {
            icon.current!.src = base64;
            insertOrUpdateAndSave({
              ...stick,
              icon: {
                base64,
                isCached: true,
              },
            });
          }
        });
      }
    } else {
      toasti("no ref", "error");
    }
  }, [icon.current]);

  const handleOpenURL = () => {
    if (isUrlValid) {
      window.location.href = stick.url;
    } else {
      toasti("Not an URL, Please fix it", "warning");
    }
  };

  // TODO Add Selecting in future
  const handleClick = (_: React.MouseEvent) => {};

  return (
    <>
      <Draggable
        handle=".handle"
        defaultPosition={stick.position}
        scale={1}
        // onStart={handleDragStart}
        // onDrag={handleOnDrag}
        onStop={handleDragStop}
      >
        <div
          className={"handle grabbable"}
          style={{
            ...stickStyle,
          }}
          onDoubleClick={handleOpenURL}
          onClick={handleClick}
        >
          {isUrlValid ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
              className="icon-container"
            >
              <img
                ref={icon}
                alt="icon"
                style={{
                  width: 40,
                  height: 40,
                }}
              />
            </div>
          ) : (
            <div></div>
          )}
          <div className="handle">{stick.title}</div>
        </div>
      </Draggable>
    </>
  );
};
export default Stick;
