/**
 * This module handles starting the service worker
 * It also handles checking to make sure the IPFS node is running in the servce worker
 *
 */

const { createProxyClient } = require("ipfs-postmsg-proxy"); // How this module talking to the service worker
let ipfs;

export async function init() {
  // return a promise for an IPFS proxy instance
  return new Promise(async (resolve, reject) => {
    // Always register the service worker to get started
    let registration = await navigator.serviceWorker.register(
      "service-worker.js",
      { scope: "/" }
    );

    // When service worker state activates, start up the proxy client to connect to it
    // Experimental tho: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/oncontrollerchange
    navigator.serviceWorker.oncontrollerchange = function () {
      this.controller.onstatechange = function () {
        if (this.state === "activated") {
          resolve(startIPFSClient());
        }
      };
    };

    // check to see if there's a service worker running, but missing an IPFS node
    if (!ipfs && registration.active) {
      // if no node, then load one up in this service worker
      console.log(`Active but no ipfs`);
      try {
        await exchangeMessages("startIPFSNode"); // await for it to finish before using it
        resolve(startIPFSClient());
      } catch (error) {
        reject(error);
      }
    }
  });
}

function exchangeMessages(message) {
  // https://googlechrome.github.io/samples/service-worker/post-message/
  // This wraps the message posting/response in a promise, which will resolve if the response doesn't
  // contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
  // controller.postMessage() and set up the onmessage handler independently of a promise, but this is
  // a convenient wrapper.
  return new Promise(function (resolve, reject) {
    var messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = function (event) {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        console.log("loaded response: ", event.data);
        resolve(event.data);
      }
    };

    // This sends the message data as well as transferring messageChannel.port2 to the service worker.
    // The service worker can then use the transferred port to reply via postMessage(), which
    // will in turn trigger the onmessage handler on messageChannel.port1.
    // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
    navigator.serviceWorker.controller.postMessage(message, [
      messageChannel.port2,
    ]);
  });
}

const startIPFSClient = () => {
  ipfs = createProxyClient({
    addListener: navigator.serviceWorker.addEventListener.bind(
      navigator.serviceWorker
    ),
    postMessage: (data) => navigator.serviceWorker.controller.postMessage(data),
  });
  return ipfs;
};