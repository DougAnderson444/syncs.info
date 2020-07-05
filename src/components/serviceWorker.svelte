<script>
  import { onMount } from 'svelte'
  import * as sw from '../js/connectServiceWorker.js'

  export let nodeId
  var ipfs

  onMount(async () => {
    ipfs = await sw.init()
    nodeId = (await ipfs.id()).id
  })

  const handleClick = async () => {
    nodeId = await getIpfsId()
  }

  const getIpfsId = async () => {
    try {
      const { agentVersion, id } = await ipfs.id()
      console.log('Ipfs is: ', id, 'Version: ', agentVersion)
      return id
    } catch (error) {
      console.log('Ipfs not ready yet', error)
      return false
    }
  }
</script>

NodeId: {nodeId}
<button on:click={handleClick}>Get NodeId</button>
