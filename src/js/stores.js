import { writable, derived, readable } from "svelte/store";
import { DATA_FOLDER_KEY_NAME } from "./constants";

export const ipfsNode = writable(0);
export const nodeId = writable(0);
export const nodeAgentVersion = writable(0);
export const nodeProtocolVersion = writable(0);
export const rootHash = writable(0);
export const dataRootHash = writable(0);

export const appSection = writable(0);
export const walletSection = writable(0);
export const username = writable("");
export const password = writable("");
export const pemEncrypted = writable(0);
export const deviceName = writable(0);
export const deviceType = writable(0);
export const error = writable(0);
export const dnsSuccess = writable(0);

export const wallet = writable(0);
export const rootCidPem = writable(0);
export const dataPeerId = writable(0);

const pub = async([$dataRootHash]) => {
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

const removeKey = async (node, keyName) => {
  const keysList = await node.key.list();
  const hasKey = keysList.some(({ name }) => name === keyName);

  if (!hasKey) {
    return;
  }

  await node.key.rm(keyName);
};

const importKey = async (node, keyName, pem, password) => {
  await removeKey(node, keyName);

  await node.key.import(keyName, pem, password);
};

const generateKeyName = () => `js-ipid-${generateRandomString()}`;

const generateRandomString = () => {
  Math.random().toString(36).substring(2);
};
