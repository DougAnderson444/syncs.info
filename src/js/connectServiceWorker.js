/**
 * This module handles starting the service worker
 * It also handles checking to make sure the IPFS node is running in the servce worker
 *
 */

export async function init(username) {
  // return a promise for an IPFS proxy instance
  return new Promise(async (resolve, reject) => {
    // Always register the service worker to get started
    let registration = await navigator.serviceWorker.register(
      "/service-worker.js",
      { scope: "/" }
    );

    registration.update(); //https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/update

    var serviceWorker;
    if (registration.installing) {
      serviceWorker = registration.installing;
    } else if (registration.waiting) {
      serviceWorker = registration.waiting;
    } else if (registration.active) {
      serviceWorker = registration.active;
    }

    if (serviceWorker) {
      //console.log(serviceWorker.state);
      serviceWorker.addEventListener("statechange", function (e) {
        //console.log("State change: ", e.target.state);
      });
    }

    if (navigator.serviceWorker.controller) {
      console.log(
        "controller.state ",
        navigator.serviceWorker.controller.state
      );
      navigator.serviceWorker.controller.addEventListener(
        "statechange",
        function (e) {
          console.log("Controller State change: ", e.target.state);
        }
      );
    } else {
      console.log("No controller right now");
    }

    // check to see if there's a service worker running, but missing an IPFS node
    if (registration.active && navigator.serviceWorker.controller) {
      try {
        let res = await exchangeMessages(
          JSON.stringify({ func: "id", args: [username] })
        );
        resolve(res);
      } catch (error) {
        reject(error);
      }
    }

    // Experimental: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/oncontrollerchange
    navigator.serviceWorker.oncontrollerchange = function () {
      this.controller.onstatechange = async () => {
        console.log(
          "controller state change: ",
          navigator.serviceWorker.controller.state
        );
        // service worker changed to active
        if (this.state === "activated") {
          try {
            let res = await exchangeMessages(
              JSON.stringify({ func: "id", args: [username] })
            );
            resolve(res);
          } catch (error) {
            reject(error);
          }
        }
      };
    };
  });
}

export function exchangeMessages(message) {
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
