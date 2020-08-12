<script>
  import * as node from '../js/ipfsNode.js'
  
  //svelte stores
  import { ipfsNode } from '../js/stores.js'
  import { onMount } from 'svelte'

  export let username

  onMount(async () => {
    try {
      $ipfsNode = await node.get(username)
      const peerInfos = await $ipfsNode.swarm.peers()
      console.log(`Peers are `, peerInfos)
    } catch (error) {
      console.log(error)
    }
  })
</script>