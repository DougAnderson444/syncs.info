import { timestamp, files, shell, routes } from "@sapper/service-worker";
const { createProxyServer } = require("ipfs-postmsg-proxy");
//const node = require("./js/ipfsNode");

//import { parseCreateUserMsg } from "./js/bridgeFunctions.js";
//import * as pro from "./js/process";
//import { startPings } from "./js/pubsubApplet";

//let ipfsNode;

const ASSETS = `cache${timestamp}`;

// `shell` is an array of all the files generated by the bundler,
// `files` is an array of everything in the `static` directory
const to_cache = shell.concat(files);
const cached = new Set(to_cache);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(ASSETS)
      //.then((cache) => cache.addAll(to_cache))
      .then(() => {
        //self.skipWaiting();
      })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      // delete old caches
      for (const key of keys) {
        if (key !== ASSETS) await caches.delete(key);
      }
      self.clients.claim(); // claim control of the service worker business
    })
  );
});

async function nodeGetter(username) {
  // start the ipfs node
  try {
    let ipfs = await node.get(username);
    ipfsNode = ipfs;
    //connectProxy();
    const { agentVersion, id } = await ipfs.id();
    const peerInfos = await ipfs.swarm.peers();
    console.log(`The peers are `, peerInfos);
  } catch (error) {
    console.log(error);
  }
}

self.addEventListener("message", async (event) => {
  let data;
  try {
    data = JSON.parse(event.data);
  } catch (e) {}
  console.log(data);

  /*
  if (data) {
    switch (data.func) {
      case "id":
        await nodeGetter(data.args[0]);
        const { id } = await ipfsNode.id();
        event.ports[0].postMessage(id.toString());
        break;
      case "save":
        //console.log(`save data `, data.args[0]);
        let cidStr;
        for await (const result of ipfsNode.add(data.args[0])) {
          //console.log(result);
          cidStr = result.cid.toString();
        }
        //console.log("cid: ", cidStr);
        await fetch(`https://super.peerpiper.io:8088/ipfs/${cidStr}`);
        event.ports[0].postMessage(cidStr);
        break;

      case "createUser":
        const {
          username,
          password,
          deviceName,
          deviceType,
          apiUrl,
          wsUrl,
        } = parseCreateUserMsg(data.args);
        await pro.createNewUser(
          username,
          password,
          deviceName,
          deviceType,
          ipfsNode,
          apiUrl,
          wsUrl
        );
        event.ports[0].postMessage("User Created");
        break;

      default:
        break;
    }
  }
  */
});
/*
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || event.request.headers.has("range"))
    return;

  const url = new URL(event.request.url);

  // don't try to handle e.g. data: URIs
  if (!url.protocol.startsWith("http")) return;

  // ignore dev server requests
  if (
    url.hostname === self.location.hostname &&
    url.port !== self.location.port
  )
    return;

  // always serve static files and bundler-generated assets from cache
  if (url.host === self.location.host && cached.has(url.pathname)) {
    event.respondWith(caches.match(event.request));
    return;
  }

  // for pages, you might want to serve a shell `service-worker-index.html` file,
  // which Sapper has generated for you. It's not right for every
  // app, but if it's right for yours then uncomment this section
  /*
	if (url.origin === self.origin && routes.find(route => route.pattern.test(url.pathname))) {
		event.respondWith(caches.match('/service-worker-index.html'));
		return;
	}
	*/
/*
  if (event.request.cache === "only-if-cached") return;

  // for everything else, try the network first, falling back to
  // cache if the user is offline. (If the pages never change, you
  // might prefer a cache-first approach to a network-first one.)
  event.respondWith(
    caches.open(`offline${timestamp}`).then(async (cache) => {
      try {
        const response = await fetch(event.request);
        cache.put(event.request, response.clone());
        return response;
      } catch (err) {
        const response = await cache.match(event.request);
        if (response) return response;

        throw err;
      }
    })
  );
});


connectProxy()
function connectProxy() {
  createProxyServer(() => ipfsNode, {
    addListener: self.addEventListener && self.addEventListener.bind(self),
    removeListener:
      self.removeEventListener && self.removeEventListener.bind(self),
    postMessage: (data) => {
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => client.postMessage(data));
      });
    },
  });
}
*/
