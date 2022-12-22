import React, { useEffect, useState } from "react";
import DesktopCanvas from "../components/DesktopCanvas";
import ToolBar from "../components/ToolBar";
import AppContext from "../context/AppContext";
import { useStick } from "../hooks/useStick";
import { IStick } from "../types/types";
import { getSticks } from "../ultis/stickUtils";

const Home: React.FC = () => {
  const [sticks, setSticks] = useState<IStick[]>([]);
  const {
    insertOrUpdateAndSave,
    // selectedStick, selectStick, unselectStick
  } = useStick(sticks);

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
