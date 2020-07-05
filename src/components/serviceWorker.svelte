<script>
  import { onMount } from 'svelte'
  const { createProxyClient } = require('ipfs-postmsg-proxy')

  export let nodeId
  var ipfs, tryIpfs

  onMount(async () => {
    console.log(`mounted`)
    navigator.serviceWorker.register('service-worker.js', { scope: '/' })
    //navigator.serviceWorker.oncontrollerchange = startIPFSClient()

    navigator.serviceWorker.oncontrollerchange = function () {
      this.controller.onstatechange = function () {
        if (this.state === 'activated') {
          startIPFSClient()
        }
      }
    }
  })

  const startIPFSClient = () => {
    ipfs = createProxyClient({
      addListener: navigator.serviceWorker.addEventListener.bind(
        navigator.serviceWorker,
      ),
      postMessage: (data) =>
        navigator.serviceWorker.controller.postMessage(data),
    })
    console.log('`ipfs` client created')
    tryIpfs = setInterval(getIpfsId, 3500) // attempt to access ipfs until it confirmed loaded
  }

  const handleClick = async () => {
    const { agentVersion, id } = await ipfs.id()
    nodeId = id
    console.log(typeof ipfs.isOnline === 'function')
  }

  const getIpfsId = async () => {
    console.log('get `ipfs` id')
    try {
      const { agentVersion, id } = await ipfs.id()
      nodeId = id
      clearInterval(tryIpfs)
    } catch (error) {
      console.log('Ipfs not ready yet', error)
    }
  }
</script>

NodeId: {nodeId}
<button on:click={handleClick}>Get NodeId</button>
