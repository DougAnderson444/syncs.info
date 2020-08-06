"use strict";

const IpfsHttpClient = require("ipfs-http-client");
const ipns = require("ipns");
const IPFS = require("ipfs");
const pRetry = require("p-retry");
const base64url = require("base64url");
const last = require("it-last");
var Buffer = require("buffer/").Buffer; // note: the trailing slash is important!

const goPush = async (pem, apiMultiAddr, wsMultiAddr, content) => {
  const namespace = "/record/";
  const retryOptions = {
    retries: 5,
  };

  let keyName = "self";
  let ipfsAPI; // remote server IPFS node

  // use pem to create local ipfs node with 'self' key = pem
  const ipfsBrowser = await createIpfsBrowser(pem)

  // 3 Steps process:
  // Connect to GoNode API (to control it),
  // connect to GoNode via websocket (for pubsub),
  // publish the content on the node
  await nodeConnect(apiMultiAddr);
  await wsConnect(wsMultiAddr);
  await publish(content);

  async function createIpfsBrowser(pem) {
    const privKeyRaw = await IPFS.crypto.keys.import(pem); // convert to JWK raw format
    const b64pk = Buffer.from(privKeyRaw.bytes).toString("base64"); // raw to base64

    const pemHash = await IPFS.multihashing.digest(
      Buffer.from(privKeyRaw.bytes),
      "sha2-256"
    ); // hash the pem for the repo name

    let options = new Object();
    options.repo = "ipfs-" + pemHash.toString("hex");
    options.EXPERIMENTAL = { ipnsPubsub: true };

    // using base64 privKey
    options.init = new Object();
    options.init.privateKey = b64pk;

    return await IPFS.create(options);
  }

  // Connect to a Go-IPFS-Node remotely through its API
  async function nodeConnect(apiMultiAddr) {
    ipfsAPI = IpfsHttpClient(apiMultiAddr);
    const { id, agentVersion } = await ipfsAPI.id();
  }

  // Connect to the same Go-IPFS-Node remotely via websocket, so pubsub works
  async function wsConnect(addr) {
    if (!addr) throw new Error("Missing peer multiaddr");
    if (!ipfsBrowser)
      throw new Error("Wait for the local IPFS node to start first");

    await ipfsBrowser.swarm.connect(addr);
    const peers = await ipfsBrowser.swarm.peers();
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
  async function publish(content) {
    if (!content) throw new Error("Missing ipns content to publish");
    if (!ipfsAPI) throw new Error("Connect to a go-server node first");
    if (!ipfsAPI.name.pubsub.state() || !ipfsBrowser.name.pubsub.state())
      throw new Error(
        "IPNS Pubsub must be enabled on bother peers, use --enable-namesys-pubsub"
      );

    let browserNode = await ipfsBrowser.id();
    let serverNode = await ipfsAPI.id();

    let keys = { name: "self", id: browserNode.id }; // default init

    last(ipfsAPI.name.resolve(keys.id, { stream: false })); // save the pubsub topic to the server to make them listen

    // set up the topic from ipns key
    let b58 = await IPFS.multihash.fromB58String(keys.id);
    const ipnsKeys = ipns.getIdKeys(b58);
    const topic = `${namespace}${base64url.encode(
      ipnsKeys.routingKey.toBuffer()
    )}`;

    // confirm they are subscribed
    await waitForPeerToSubscribe(ipfsAPI, topic); // confirm topic is on THEIR list  // API
    await waitForNotificationOfSubscription(ipfsBrowser, topic, serverNode.id); // confirm they are on OUR list

    let remList = await ipfsAPI.pubsub.ls(); // API
    if (!remList.includes(topic)) console.log(`[Fail] !Pubsub.ls ${topic}`);

    let remListSubs = await ipfsAPI.name.pubsub.subs(); // API
    if (!remListSubs.includes(`/ipns/${keys.id}`))
      console.log(`[Fail] !Name.Pubsub.subs ${keys.id}`);

    // publish will send a pubsub msg to the server to update their ipns record
    console.log(`Publishing ${content} to ${keys.name} /ipns/${keys.id}`);
    const results = await ipfsBrowser.name.publish(content, {
      resolve: false,
      key: keyName,
    });
    console.log(`Published ${results.name} to ${results.value}`); //

    let name = await last(
      ipfsAPI.name.resolve(keys.id, {
        stream: false,
      })
    );

    if (name == content) {
      console.log(`Look at that! /ipns/${keys.id} resolves to ${content}`);
    } else {
      console.log(`Error, resolve did not match ${name} !== ${content}`);
    }
  }
};

export default goPush;
