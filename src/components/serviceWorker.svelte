<script>
  import { onMount } from 'svelte'
  const { createProxyClient } = require('ipfs-postmsg-proxy')

  export let nodeId
  var ipfs

  onMount(async () => {
    // 1. Band new load and no sw or ipfs
    // 2. refresh, sw but no ipfs
    // 3. Closed window, reopened... sw but no ipfs?

    let registration = await navigator.serviceWorker.register(
      'service-worker.js',
      { scope: '/' },
    )

    // Experimental tho: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/oncontrollerchange
    navigator.serviceWorker.oncontrollerchange = function () {
      this.controller.onstatechange = function () {
        if (this.state === 'activated') {
          startIPFSClient()
        }
      }
    }

    // check to see ifthere's a node running ok already
    if (!ipfs && registration.active) {
      // if no node, then load one up
      console.log(`Active but no ipfs`)
      await exchangeMessages('startIPFSNode') // await for it to finish before using it
      startIPFSClient()
    }
  })

  function exchangeMessages(message) {
    // https://googlechrome.github.io/samples/service-worker/post-message/
    // This wraps the message posting/response in a promise, which will resolve if the response doesn't
    // contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
    // controller.postMessage() and set up the onmessage handler independently of a promise, but this is
    // a convenient wrapper.
    return new Promise(function (resolve, reject) {
      var messageChannel = new MessageChannel()
      messageChannel.port1.onmessage = function (event) {
        if (event.data.error) {
          reject(event.data.error)
        } else {
          console.log('loaded response: ', event.data)
          resolve(event.data)
        }
      }

      // This sends the message data as well as transferring messageChannel.port2 to the service worker.
      // The service worker can then use the transferred port to reply via postMessage(), which
      // will in turn trigger the onmessage handler on messageChannel.port1.
      // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
      navigator.serviceWorker.controller.postMessage(message, [
        messageChannel.port2,
      ])
    })
  }
  const startIPFSClient = () => {
    ipfs = createProxyClient({
      addListener: navigator.serviceWorker.addEventListener.bind(
        navigator.serviceWorker,
      ),
      postMessage: (data) =>
        navigator.serviceWorker.controller.postMessage(data),
    })
    console.log('`ipfs` client created')
    getIpfsId()
  }

  const handleClick = async () => {
    const { agentVersion, id } = await ipfs.id()
    nodeId = id
    console.log(typeof ipfs.isOnline === 'function')
  }

  const getIpfsId = async () => {
    try {
      const { agentVersion, id } = await ipfs.id()
      nodeId = id
      console.log('Ipfs is: ', id)
    } catch (error) {
      console.log('Ipfs not ready yet', error)
    }
  }
</script>

NodeId: {nodeId}
<button on:click={handleClick}>Get NodeId</button>
