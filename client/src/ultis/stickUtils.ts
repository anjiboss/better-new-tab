import axios from "axios";
import { IStick } from "../types/types";
import { KEY } from "../constant/default";

const getRemoteSticks = async () => {
  const accessToken = window.localStorage.getItem("accessToken");
  const data = await axios({
    method: "GET",
    url: `${import.meta.env.VITE_API_URL}/api/v1/stick`,
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  return data.data.sticks as IStick[];
};

async function getLocalSticks(): Promise<IStick[]> {
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

const getSticks = async (): Promise<IStick[]> => {
  const localSticks = await getLocalSticks();
  const remoteSticks = await getRemoteSticks();
  // Check diff between localSticks and remoteSticks

  localSticks.forEach((localStick) => {
    const remoteStick = remoteSticks.find(
      (remoteStick) => remoteStick.url === localStick.url
    );
    if (remoteStick) {
      if (
        new Date(remoteStick.updatedAt).getTime() >
        new Date(localStick.updatedAt).getTime()
      ) {
        // Update localStick
      }
    } else {
      // Delete localStick
    }
  });

  return [];
};

export { getRemoteSticks, getLocalSticks, getSticks };
