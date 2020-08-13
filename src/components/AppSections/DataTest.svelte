<script>
  import last from 'it-last' // gets last value of async iterator
  import { onMount } from 'svelte'
  import IpfsResolve from '../IpfsResolve.svelte'
  import { goPush } from '../../js/ipnsUtils'
  //svelte stores
  import { wallet, rootCidPem, ipfsNode, username } from '../../js/stores.js'
  import { DID_DOC_TLD } from '../../js/constants.js'
  import { getDNSLinkFromName } from '../../js/utils.js'

  let cid, nodeId, dagTime, start, dnsLink, resolvedDnsLink, didDoc
  let i = 0
  let key, value
  let textContent = {}

  onMount(async () => {
    nodeId = await $ipfsNode.id() //works

    if ($rootCidPem && $ipfsNode) {
      dnsLink = await getDNSLinkFromName(`${$username}.${DID_DOC_TLD}`)
      console.log(`dnsLink`, dnsLink)
      try {
        resolvedDnsLink = await last($ipfsNode.resolve(`/ipns/${dnsLink}`))
        didDoc = await $ipfsNode.dag.get(resolvedDnsLink) //getDidDoc
      } catch (error) {}
    }
  })

  const handleSubmit = async () => {
    start = Date.now()
    textContent[i] = { key, value }
    i++
    cid = await $ipfsNode.dag.put(textContent)
    dagTime = Date.now() - start

    // check if wallet.isLocked
    // on cid change, push it to go-IPFS Node
    // Push it to the goIpfs node network
    if ($rootCidPem) {
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
      await $ipfsNode.files.write(path, content, {
        create: true,
        parents: true,
      })
      // write to disk
      cid = await $ipfsNode.files.flush('/')
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
