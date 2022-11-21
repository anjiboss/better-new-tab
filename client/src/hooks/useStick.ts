import { KEY } from "../constant/default";
import { IStick } from "../types/types";

export const useStick = (sticks: IStick[]) => {
  const insertOrUpdateAndSave = (stickToUpdate: IStick) => {
    const oldStick = sticks.filter((stick) => stick.id !== stickToUpdate.id);
    window.localStorage.setItem(
      KEY,
      JSON.stringify([...oldStick, stickToUpdate])
    );
  };

  return {
    insertOrUpdateAndSave,
  };
};
