import React, { useContext, useEffect, useMemo, useState } from "react";
import AppContext from "../context/AppContext";
import { IStick } from "../types/types";
import { getIcon, isURL } from "../ultis/utils";
import { Group, Text } from "react-konva";
import URLImage from "./URLImage";
import { KonvaEventObject } from "konva/lib/Node";
import { toasti } from "../ultis/_visual";

interface StickProps {
  children?: React.ReactNode;
  stick: IStick;
  // selected: IStick[];
  // select: (stick: IStick, isMultiple: boolean) => void;
  // unselect: (stick: IStick) => void;
}

const Stick: React.FC<StickProps> = ({ stick }) => {
  const { insertOrUpdateAndSave } = useContext(AppContext);
  const [iconSrc, setIconSrc] = useState("");

  const handleDragStop = (evt: KonvaEventObject<DragEvent>) => {
    insertOrUpdateAndSave({
      ...stick,
      ...{ position: { x: evt.target.attrs.x, y: evt.target.attrs.y } },
    });
  };
  const isUrlValid = useMemo(() => {
    return isURL(stick.url);
  }, [stick.url]);

  useEffect(() => {
    if (stick.icon.isCached) {
      setIconSrc(stick.icon.base64);
    } else {
      getIcon(stick).then((base64) => {
        if (base64) {
          setIconSrc(base64);
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
  }, []);

  const handleOpenURL = (evt: KonvaEventObject<MouseEvent>) => {
    if (isUrlValid) {
      if (evt.evt.metaKey || evt.evt.ctrlKey) {
        window.open(stick.url, "_blank");
      } else {
        window.location.href = stick.url;
      }
    } else {
      toasti("Not an URL, Please fix it", "warning");
    }
  };

  return (
    <Group
      x={stick.position.x}
      y={stick.position.y}
      width={64}
      draggable
      onDragEnd={handleDragStop}
      onDblClick={handleOpenURL}
    >
      {/* TODO Make it look like desktop Icon */}
      <URLImage src={iconSrc} x={0} y={0} />
      <Text
        text={stick.title}
        x={0}
        y={64}
        width={64}
        fill="white"
        align="center"
      />
    </Group>
  );
};
export default Stick;
