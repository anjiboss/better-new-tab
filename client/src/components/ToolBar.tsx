import React, { useContext, useState } from "react";
import { v4 } from "uuid";
import { defaultSetting } from "../constant/default";
import AppContext from "../context/AppContext";
import { IStick } from "../types/types";

const ToolBar: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [url, setUrl] = useState("");
  const { setSticks, insertOrUpdateAndSave } = useContext(AppContext);

  const handleAddStick = () => {
    const newStick: IStick = {
      id: v4(),
      position: defaultSetting.position,
      title: newTitle,
      url,
      icon: {
        base64: "",
        isCached: false,
      },
    };
    insertOrUpdateAndSave(newStick);
    setSticks((prev) => [...prev, newStick]);
    setIsAdding(false);
  };

  return (
    <>
      {isAdding && (
        <div>
          <div>
            <input
              type="text"
              value={newTitle}
              placeholder="New name"
              onChange={(e) => setNewTitle(e.currentTarget.value)}
            />
          </div>
          <div>
            <input
              type="text"
              value={url}
              placeholder="URL"
              onChange={(e) => setUrl(e.currentTarget.value)}
            />
          </div>
        </div>
      )}
      <button onClick={!isAdding ? () => setIsAdding(true) : handleAddStick}>
        Add Stick
      </button>
    </>
  );
};
export default ToolBar;
