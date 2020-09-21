import { writable, derived, readable } from "svelte/store";
import { DATA_FOLDER_KEY_NAME } from "./constants";

//  in your App.svelte just invoke the useLocalStorage function to enable the persistent state.
//  import { count } from 'store.js'; // in Component.svelte
//  count.useLocalStorage();
const createWritableStore = (key, startValue) => {
  const { subscribe, set } = writable(startValue);

  return {
    subscribe,
    set,
    useLocalStorage: () => {
      const json = window.localStorage.getItem(key);
      if (json) {
        set(JSON.parse(json));
      }

      subscribe((current) => {
        window.localStorage.setItem(key, JSON.stringify(current));
      });
    },
  };
};

export const ipfsNode = writable(0);
export const nodeId = writable(0);
export const rootHash = writable(0);
export const dataRootHash = writable(0);

export const appSection = writable(0);
export const lockerSection = writable(0);
export const backgroundComponents = writable([]);

export const username = createWritableStore("username", "");
export const password = writable("");

export const deviceName = writable(0);
export const deviceType = writable(0);
export const name = writable(0);

export const error = writable(0);
export const dnsSuccess = writable(0);

export const wallet = writable(0);
export const identity = writable(0);
export const did = writable(0);
export const rootCidStr = createWritableStore("rootCidStr", 0);
export const rootCidPem = writable(0);
export const dataPeerId = writable(0);
export const dnsLink = writable(0);

export const publishingOn = writable(0);
export const serviceEndpoint = createWritableStore("serviceEndpoint", "");
export const aesKey32 = writable(0);

export const makeDrives = writable(0);
export const makeCores = writable(0);

export const drive = writable(0);

const pub = async ([$dataRootHash]) => {
  console.log(`Publishing $dataRootHash: `, $dataRootHash);
  /*
  try {
    const path = `/ipfs/${$dataRootHash}`;

    await $ipfsNode.name.publish(path, {
      lifetime: "87600h",
      ttl: "87600h",
      key: DATA_FOLDER_KEY_NAME,
    });
  } catch (err) {
    console.log(`Publishing rootHash error: `, err);
  }
  */
};

//Derives a store from one or more other stores. Whenever those dependencies change, the callback runs.
export const pubdate = derived([dataRootHash], pub);

// start function is called when the store gets its first subscriber;
export const time = readable(new Date(), function start(set) {
  const interval = setInterval(() => {
    set(new Date());
  }, 250);

  //stop is called when the last subscriber unsubscribes
  return function stop() {
    clearInterval(interval);
  };
});

// ### elaspe timer
// this can be reset with: $start = new Date();
export const start = writable(new Date());

//Derives a store from one or more other stores. Whenever those dependencies change, the callback runs.
export const elapsed = derived([time, start], ([$time, $start]) =>
  Math.max(Math.round(($time - $start) / 250), 2)
);
