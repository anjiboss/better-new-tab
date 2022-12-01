import { useState } from "react";
import { KEY } from "../constant/default";
import { IStick } from "../types/types";

export const useStick = (sticks: IStick[]) => {
  const [selectedStick, setSeletectStick] = useState<IStick[]>([]);

  const insertOrUpdateAndSave = (stickToUpdate: IStick) => {
    const oldStick = sticks.filter((stick) => stick.id !== stickToUpdate.id);
    window.localStorage.setItem(
      KEY,
      JSON.stringify([...oldStick, stickToUpdate])
    );
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
