<script>
  import * as sw from '../../../js/connectServiceWorker.js'
  import { createProxyClient } from 'ipfs-postmsg-proxy'

  //svelte stores
  import { ipfsNode } from '../../../js/stores.js'
  import { onMount } from 'svelte'

  export let nodeId
  let cid = ''
  let value = ''
  let peerInfo
  onMount(async () => {
    let isDev = window.location.hostname.includes('localhost')
    let splitHost = window.location.hostname.split('.')
    let username

    if (
      (!isDev && splitHost.length === 3) ||
      (isDev && splitHost.length === 2)
    ) {
      username = splitHost[0]
    }

    if ('serviceWorker' in navigator && username) {
      nodeId = await sw.init(username)
      if (!nodeId) {
        nodeId = await sw.exchangeMessages(
          JSON.stringify({ func: 'id', args: [username] }),
        )
      }
      $ipfsNode = createProxyClient({
        addListener: navigator.serviceWorker.addEventListener.bind(
          navigator.serviceWorker,
        ),
        postMessage: (data) =>
          navigator.serviceWorker.controller.postMessage(data),
      })
      peerInfo = await $ipfsNode.id()
      console.log(`proxy nodeid is ${peerInfo.id}`)
    } else {
      console.log('No service-worker on this browser')
    }
  })
</script>

<style>
  .tiny {
    font-size: 0.7rem;
  }
</style>

{#if nodeId}
  {#await nodeId then nodeId}
    <div class="tiny">
      NodeId: {nodeId}
      <br />
      <p>Service Worker is running.</p>
    </div>

  {/await}
{/if}

{#if peerInfo}
  {#await peerInfo then peerInfo}
    <div class="tiny">
      Proxy NodeId: {peerInfo.id}
      <br />
      <p>Proxy is working.</p>
    </div>

  {/await}
{/if}
