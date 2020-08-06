<script>
  import { onMount } from 'svelte'
  import * as sw from '../../../js/connectServiceWorker.js'

  export let nodeId
  let cid = ''
  export let value = ''

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
      console.log(`init `, username)
      nodeId = await sw.init(username)
      console.log(`nodeid is ${nodeId}`)
      if (!nodeId) {
        nodeId = await sw.exchangeMessages(
          JSON.stringify({ func: 'id', args: [username] }),
        )
        console.log(`nodeid is ${nodeId}`)
      }
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
    <p>Save some text to IPFS:</p>
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
