const IpfsHttpClient = require("ipfs-http-client");
const ipns = require("ipns");
const IPFS = require("ipfs");
const pRetry = require("p-retry");
const base64url = require("base64url");
const last = require("it-last");
const Buffer = require("buffer/").Buffer; // Note: the trailing slash is important!

const namespace = "/record/";
const retryOptions = {
  retries: 5,
};

const keyName = "self";
let ipfsAPI; // Remote server IPFS node
let ipfsBrowser;

async function createIpfsBrowser(pem) {

  if (!ipfsBrowser) {
    const privKeyRaw = await IPFS.crypto.keys.import(pem); // Convert to JWK raw format
    const b64pk = Buffer.from(privKeyRaw.bytes).toString("base64"); // Raw to base64

    const pemHash = await IPFS.multihashing.digest(
      Buffer.from(privKeyRaw.bytes),
      "sha2-256"
    ); // Hash the pem for the repo name

    const options = new Object();

    options.repo = `ipfs-${pemHash.toString("hex")}`;
    options.EXPERIMENTAL = { ipnsPubsub: true };

    // Using base64 privKey
    options.init = new Object();
    options.init.privateKey = b64pk;
    ipfsBrowser = await IPFS.create(options);
  } else {
    await ipfsBrowser.start();
  }

  return ipfsBrowser;
}

// Connect to a Go-IPFS-Node remotely through its API
async function nodeConnect(apiMultiAddr) {
  try {
    ipfsAPI = IpfsHttpClient(apiMultiAddr);
    const { id } = await ipfsAPI.id();
  } catch (error) {
    console.log(error)
  }
}

// Connect to the same Go-IPFS-Node remotely via websocket, so pubsub works
async function wsConnect(addr) {
  if (!addr) {
    throw new Error("Missing peer multiaddr");
  }
  if (!ipfsBrowser) {
    throw new Error("Wait for the local IPFS node to start first");
  }

  await ipfsBrowser.swarm.connect(String(addr));
}

// Utility fn, Wait until a peer subscribes a topic
const waitForPeerToSubscribe = async (daemon, topic) => {
  await pRetry(async () => {
    const res = await daemon.pubsub.ls();

    if (!res || !res.length || !res.includes(topic)) {
      throw new Error("Could not find subscription");
    }

    return res[0];
  }, retryOptions);
};

// Utility fn, wait until a peer know about other peer to subscribe a topic
const waitForNotificationOfSubscription = (daemon, topic, peerId) =>
  pRetry(async () => {
    const res = await daemon.pubsub.peers(topic);

    if (!res || !res.length || !res.includes(peerId)) {
      throw new Error("Could not find peer subscribing");
    }
  }, retryOptions);

// Main routine, publish to IPNS once set up is complete
async function publish(cidStr) {
  if (!cidStr) {
    throw new Error("Missing cidStr to publish");
  }
  if (!ipfsAPI) {
    throw new Error("Connect to a go-server node first");
  }
  if (!ipfsAPI.name.pubsub.state() || !ipfsBrowser.name.pubsub.state()) {
    throw new Error(
      "IPNS Pubsub must be enabled on bother peers, use --enable-namesys-pubsub"
    );
  }

  const browserNode = await ipfsBrowser.id();
  const serverNode = await ipfsAPI.id();

  const keys = { name: "self", id: browserNode.id }; // Default init

  last(ipfsAPI.name.resolve(keys.id, { stream: false })); // Save the pubsub topic to the server to make them listen

  // set up the topic from ipns key
  const b58 = await IPFS.multihash.fromB58String(keys.id);
  const ipnsKeys = ipns.getIdKeys(b58);
  const topic = `${namespace}${base64url.encode(
    ipnsKeys.routingKey.toBuffer()
  )}`;

  // Confirm they are subscribed
  await waitForPeerToSubscribe(ipfsAPI, topic); // Confirm topic is on THEIR list  // API
  await waitForNotificationOfSubscription(ipfsBrowser, topic, serverNode.id); // Confirm they are on OUR list

  const remList = await ipfsAPI.pubsub.ls(); // API

  if (!remList.includes(topic)) {
    console.log(`[Fail] !Pubsub.ls ${topic}`);
  }

  const remListSubs = await ipfsAPI.name.pubsub.subs(); // API

  if (!remListSubs.includes(`/ipns/${keys.id}`)) {
    console.log(`[Fail] !Name.Pubsub.subs ${keys.id}`);
  }

  // Publish will send a pubsub msg to the server to update their ipns record
  const results = await ipfsBrowser.name.publish(
    `/ipfs/${cidStr}`,
    {
      resolve: false,
      key: keyName,
      lifetime: '87600h',
      ttl: '87600h',
    }
  );

  last(
    ipfsAPI.name.resolve(keys.id, {
      stream: false,
    })
  ).catch((error) => {
      console.log(error);
    });

  // try to pin
  // if pin fails, then try again
  let pinset = [];
  let i = 0;

  while (!pinset.find((p) => p.cid.toString() == cidStr ) && i<10) {
    i++;
    console.log(
      `Pin attempt ${i} for ${cidStr} at ${new Date(Date.now()).toLocaleTimeString()}`
    );
    pinset = await ipfsAPI.pin.add(cidStr, { timeout: 15000 }); // 
    console.log(`pinset is `, pinset)
  }

  console.log("pinned", pinset, `${new Date(Date.now()).toLocaleTimeString()}`);

}

export const goPush = async (pem, apiMultiAddr, wsMultiAddr, cidStr) => {
  // Use pem to create local ipfs node with 'self' key = pem
  ipfsBrowser = await createIpfsBrowser(pem);

  // 3 Steps process:
  // Connect to GoNode API (to control it),
  // connect to GoNode via websocket (for pubsub),
  // publish the cidStr on the node
  await nodeConnect(apiMultiAddr);
  await wsConnect(wsMultiAddr);
  await publish(cidStr);

  await ipfsBrowser.stop();
};

//export default goPush;
