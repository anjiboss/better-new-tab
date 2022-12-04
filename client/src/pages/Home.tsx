import React, { useEffect, useState } from "react";
import DesktopCanvas from "../components/DesktopCanvas";
import Stick from "../components/Stick";
import ToolBar from "../components/ToolBar";
import { KEY } from "../constant/default";
import AppContext from "../context/AppContext";
import { useStick } from "../hooks/useStick";
import { IStick } from "../types/types";

async function getSticks(): Promise<IStick[]> {
  const stickString = window.localStorage.getItem(KEY);
  if (stickString) {
    try {
      return JSON.parse(stickString);
    } catch (__) {
      console.log("pasing to json error with : ", stickString);
    }
  }
  return [];
}

const Home: React.FC = () => {
  const [sticks, setSticks] = useState<IStick[]>([]);
  const { insertOrUpdateAndSave, selectedStick, selectStick, unselectStick } =
    useStick(sticks);

  useEffect(() => {
    getSticks().then((sticks) => {
      setSticks(sticks);
    });
  }, []);

  return (
    <AppContext.Provider value={{ sticks, setSticks, insertOrUpdateAndSave }}>
      <div>
        {/* <ToolBar> */}
        <ToolBar />
        {/* Show Sticks */}
        <DesktopCanvas sticks={sticks} />
      </div>
    </AppContext.Provider>
  );
};

export default Home;
