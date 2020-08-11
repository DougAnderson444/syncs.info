<script>
  import * as node from '../js/ipfsNode.js'
  //const node = require("../js/ipfsNode");
  import DataTest from './DataTest.svelte'

  //svelte stores
  import { ipfsNode } from '../js/stores.js'
  import { onMount } from 'svelte'

  export let username
  let nodeId

  onMount(async () => {
    try {
      $ipfsNode = await node.get(username)
      const { agentVersion, id } = await $ipfsNode.id()
      console.log(`IPFS.id `, id)
      nodeId = id
      const peerInfos = await $ipfsNode.swarm.peers()
      console.log(`Peers are `, peerInfos)
    } catch (error) {
      console.log(error)
    }
  })
</script>

{#if nodeId}
  <center>nodeId: {nodeId}</center>
  <DataTest ipfs={$ipfsNode} />
{/if}
