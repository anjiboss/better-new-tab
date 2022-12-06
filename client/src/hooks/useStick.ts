import axios from "axios";
import { useState } from "react";
import { KEY } from "../constant/default";
import { IStick } from "../types/types";

export const useStick = (sticks: IStick[]) => {
  const [selectedStick, setSeletectStick] = useState<IStick[]>([]);

  const updateToSever = (sticks: IStick[]) => {
    const accessToken = window.localStorage.getItem("accessToken");
    axios({
      method: "POST",
      url: `${import.meta.env.VITE_API_URL}/api/v1/stick`,
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      data: {
        sticks: sticks.map((stick) => ({
          ...stick,
          icon: JSON.stringify({
            isCached: false,
          }),
          position: JSON.stringify(stick.position),
        })),
      },
    }).then(({ data }) => {
      console.log(data);
    });
  };

  const insertOrUpdateAndSave = (stickToUpdate: IStick) => {
    const oldStick = sticks.filter((stick) => stick.id !== stickToUpdate.id);
    window.localStorage.setItem(
      KEY,
      JSON.stringify([...oldStick, stickToUpdate])
    );
    updateToSever([...oldStick, stickToUpdate]);
    console.log("DB updated for stick: ", stickToUpdate.title);
  };

  const selectStick = (stick: IStick, isMultiple: boolean) => {
    setSeletectStick((prev) => {
      if (selectedStick.find((_s) => _s.id === stick.id)) {
        return prev;
      } else {
        return isMultiple ? [...prev, stick] : [stick];
      }
    });
  };

  const unselectStick = (stick: IStick) => {
    setSeletectStick((prev) => {
      if (!selectedStick.find((_s) => _s.id === stick.id)) {
        return prev;
      } else {
        return prev.filter((_s) => _s.id !== stick.id);
      }
    });
  };

  return {
    insertOrUpdateAndSave,
    selectedStick,
    selectStick,
    unselectStick,
  };
};
