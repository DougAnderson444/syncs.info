<script>
  import { onMount } from 'svelte'
  import * as sw from '../js/connectServiceWorker.js'
  import DataTest from './DataTest.svelte'

  export let nodeId, cid

  onMount(async () => {
    await sw.init()
    nodeId = await sw.exchangeMessages('id')
    cid = sw.exchangeMessages('testData')
  })
</script>

{#if nodeId}
  {#await nodeId then nodeId}
    NodeId: {nodeId}
    <br />
  {/await}
{/if}

{#if cid}
  {#await cid then cid}
    <a href="https://explore.ipld.io/#/explore/{cid}" target="_blank">Cid:</a>
    {cid}
    <br />
  {/await}
{/if}
