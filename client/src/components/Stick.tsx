import React, {
  CSSProperties,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import AppContext from "../context/AppContext";
import { IStick } from "../types/types";
import { isURL } from "../ultis/utils";
import { toasti } from "../ultis/_visual";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import axios from "axios";

interface StickProps {
  children?: React.ReactNode;
  stick: IStick;
}

const stickStyle: CSSProperties = {
  height: 50,
  width: 100,
  padding: 10,
  border: "1px solid #E5E059",
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
};

const getIcon = async (stick: IStick) => {
  const accessToken = window.localStorage.getItem("accessToken");
  const resp = await axios(
    `${import.meta.env.VITE_API_URL}/api/v1/icon/?url=${stick.url}`,
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  console.log(resp.data);
  if (resp.data.ok) {
    return "data:image/png;base64," + resp.data.data.base64;
  }
  return undefined;
};

const Stick: React.FC<StickProps> = ({ stick }) => {
  const { insertOrUpdateAndSave } = useContext(AppContext);
  const icon = useRef<HTMLImageElement>(null);

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
          console.log(base64);
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
          className="handle grabbable"
          style={stickStyle}
          onDoubleClick={handleOpenURL}
        >
          {isUrlValid ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img ref={icon} alt="icon" />
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
