<script>
  import { onMount } from 'svelte'
  import * as sw from '../js/connectServiceWorker.js'
  import DataTest from './DataTest.svelte'

  export let nodeId
  let cid = ''
  export let value = ''

  onMount(async () => {
    if ('serviceWorker' in navigator) {
      await sw.init()
      nodeId = await sw.exchangeMessages(
        JSON.stringify({ func: 'id', args: [] }),
      )
    } else {
      console.log('No service-worker on this browser')
    }
  })

  const handleSubmit = async () => {
    console.log(`Submitted ${value}`)
    if (value) {
      cid = await sw.exchangeMessages(
        JSON.stringify({ func: 'save', args: [value] }),
      )
      value = '' //reset
    }
  }
</script>

{#if nodeId}
  {#await nodeId then nodeId}
<!--    NodeId: {nodeId} <br /> -->
    <p>
      Save some text to IPFS:
    </p>
    <form on:submit|preventDefault={handleSubmit}>
      <input placeholder="Hello Doug from IPFS" bind:value />
    </form>
    <br />
  {/await}
{/if}

{#if cid}
  {#await cid then cid}
    <a href="https://gateway.ipfs.io/ipfs/{cid}" target="_blank">{cid}</a>
    <br />
    <a href="https://super.peerpiper.io:8088/ipfs/{cid}" target="_blank">
      {cid}
    </a>
    <br />
  {/await}
{/if}
