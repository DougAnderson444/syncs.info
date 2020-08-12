<script>
  import { onMount } from 'svelte'
  import IpfsResolve from './IpfsResolve.svelte'
  import { goPush } from '../js/ipnsUtils'
  //svelte stores
  import { wallet, rootCidPem } from '../js/stores.js'

  export let ipfs
  let cid, nodeId, dagTime, start
  let i = 0
  let key, value
  let textContent = {}

  onMount(async () => {
    nodeId = await ipfs.id() //works
  })

  const handleSubmit = async () => {
    start = Date.now()
    textContent[i] = { key, value }
    i++
    ipfs.dag.put(textContent).then((c) => {
      cid = c
      dagTime = Date.now() - start
    })

    // check if wallet.isLocked
    // on cid change, push it to go-IPFS Node
    // Push it to the goIpfs node network
    if ($rootCidPem)
      goPush(
        $rootCidPem,
        process.env.SAPPER_APP_API_URL,
        process.env.SAPPER_APP_WS_URL,
        cid,
      )
        .then(() => {
          console.log(`published to go ${Date.now() - start}ms`)
        })
        .catch((error) => {
          console.log(error)
        })
  }

  const handleClick = async () => {
    let path = '/tmp/myfile.txt'
    let content = 'ABC'

    const files = [
      {
        path: path,
        content: content,
      },
    ]

    try {
      await ipfs.files.write(path, content, {
        create: true,
        parents: true,
      })
      // write to disk
      cid = await ipfs.files.flush('/')
      console.log(cid)
    } catch (err) {
      console.log(err)
    }
  }
</script>

<style>
  ul {
    list-style: none;
  }
</style>

<br />
{#if nodeId}
  {#await nodeId then nodeId}
    <!--    NodeId: {nodeId} <br /> -->
    <p>Save some text to IPFS:</p>
    <form on:submit|preventDefault={handleSubmit}>
      <input placeholder="My favorite color" bind:value={key} name="key" />
      <input placeholder="Blue" bind:value name="value" />
      <input type="submit" value="Save" />
    </form>
    {#if textContent && cid}
      <br />
      {#if cid}
        IPLD Root Hash:
        <a href="https://explore.ipld.io/#/explore/{cid}" target="_blank">
          {cid}
        </a>
        ({dagTime})
      {/if}
      <ul>
        {#each [...Object.entries(textContent)] as [k, text]}
          <li>{k}. {text.key}: {text.value}</li>
        {/each}
      </ul>
    {/if}

  {/await}
{/if}
