import { timestamp, files, shell, routes } from "@sapper/service-worker";
const node = require("./js/ipfsNode");
import * as utils from "./js/ipfsUtils";

let ipfsNode;

const ASSETS = `cache${timestamp}`;

// `shell` is an array of all the files generated by the bundler,
// `files` is an array of everything in the `static` directory
const to_cache = shell.concat(files);
const cached = new Set(to_cache);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(ASSETS)
      .then((cache) => cache.addAll(to_cache))
      .then(() => {
        self.skipWaiting();
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
      console.log("Activiating, nodeGetter");
      await nodeGetter();

      self.clients.claim(); // claim control of the service worker business
    })
  );
});

async function nodeGetter() {
  // start the ipfs node
  try {
    let ipfs = await node.get();
    ipfsNode = ipfs;
    const { agentVersion, id } = await ipfs.id();
    console.log(`The SW node id is `, id);
  } catch (error) {
    console.log(err);
  }
}

self.addEventListener("message", async (event) => {
  switch (event.data) {
    case "startIPFSNode":
      console.log(`startIPFSNode message, nodeGetter`);
      await nodeGetter();
      event.ports[0].postMessage({ test: "This is my response." });
      break;
    case "id":
      console.log(`get id`);
      if (!ipfsNode) await nodeGetter();
      let id = await ipfsNode.id();
      event.ports[0].postMessage({ id: id });
      break;
    case "testData":
      console.log(`test a write and flush`);
      let cidStr
      for await (const result of ipfsNode.add("Hello IPFS World, from Doug")) {
        console.log(result)
        cidStr = result.cid.toString()
      }
      console.log('cid: ', cidStr )
      event.ports[0].postMessage(cidStr);
      break;
    default:
      break;
  }
});

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
