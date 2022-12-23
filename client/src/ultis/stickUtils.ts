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
  return (data.data.data.sticks as IStick[]) || [];
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

/**
 * Update sticks to remote
 * @param sticks Stick to sync to remote
 */
const updateSticks = async (sticks: IStick[]) => {
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
    console.log("synced remote stick", data);
  });
};

/**
 * Get stick from local and remote.
 * Sync remote to local if have any changes
 * @returns Stick after sync
 */
const getSticks = async (): Promise<IStick[]> => {
  const localSticks = await getLocalSticks();
  const remoteSticks = await getRemoteSticks();

  // first time login sync
  if (localSticks.length === 0 && remoteSticks.length > 0) {
    return remoteSticks;
  }

  // Check diff between localSticks and remoteSticks
  const stickToSync: IStick[] = [];
  localSticks.forEach((localStick) => {
    const remoteStick = remoteSticks.find((remoteStick) => remoteStick.id === localStick.id);
    if (remoteStick && JSON.stringify(remoteStick) !== JSON.stringify(localStick)) {
      if (new Date(remoteStick.updatedAt).getTime() > new Date(localStick.updatedAt).getTime()) {
        // Update localStick
        localStick = JSON.parse(JSON.stringify(remoteStick));
      }
    } else {
      stickToSync.push(localStick);
    }

    // Update remoteStick
    if (stickToSync.length > 0) {
      updateSticks(stickToSync);
    }

    return localStick;
  });

  return [];
};

export { getRemoteSticks, getLocalSticks, getSticks };
