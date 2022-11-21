import React from "react";
import { IStick } from "../types/types";

interface IAppContext {
  sticks: IStick[];
  setSticks: React.Dispatch<React.SetStateAction<IStick[]>>;
  insertOrUpdateAndSave: (stickToUpdate: IStick) => void;
}
const AppContext = React.createContext<IAppContext>({
  sticks: [],
  setSticks: () => {},
  insertOrUpdateAndSave: () => {},
});

export default AppContext;
