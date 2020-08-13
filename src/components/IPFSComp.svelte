<script>
  import * as node from '../js/ipfsNode.js'

  //svelte stores
  import { ipfsNode } from '../js/stores.js'
  import { onMount } from 'svelte'

  let subdomain, nodeId

  onMount(async () => {
    let isDev = window.location.hostname.includes('localhost')
    let splitHost = window.location.hostname.split('.')

    if (
      (!isDev && splitHost.length === 3) ||
      (isDev && splitHost.length === 2)
    ) {
      subdomain = splitHost[0]
    }
    if (subdomain) {
      try {
        $ipfsNode = await node.get(subdomain)
        nodeId = (await $ipfsNode.id()).id
        const peerInfos = await $ipfsNode.swarm.peers()
        console.log(`Peers are `, peerInfos)
      } catch (error) {
        console.log(error)
      }
    }
  })
</script>

<style>
  .tiny {
    font-size: 0.7rem;
    margin: 1em;
    padding: 1em;
  }
</style>

{#if subdomain && nodeId}
  {#await nodeId then nodeId}
    <div class="tiny">
      NodeId: {nodeId}
      <br />
      <p>IPFS is running.</p>
    </div>
  {/await}
{/if}
