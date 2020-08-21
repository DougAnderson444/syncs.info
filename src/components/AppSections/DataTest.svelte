<script>
  import last from 'it-last' // gets last value of async iterator
  import { onMount } from 'svelte'
  import IpfsResolve from '../IpfsResolve.svelte'
  import { goPush } from '../../js/ipnsUtils'
  import { getData } from '../../js/utils'
  import { importKey } from '../../js/ipfsUtils'
  import { getIPLDObj, toCID } from '../../js/ipfsNode'
  import ObjectComp from '../Utility/ObjectComp.svelte'

  //svelte stores
  import {
    wallet,
    rootCidStr,
    rootCidPem,
    ipfsNode,
    username,
    serviceEndpoint,
    dnsLink,
  } from '../../js/stores.js'
  import { DID_DOC_TLD, ROOT_CID_PEM } from '../../js/constants.js'
  import { getDNSLinkFromName } from '../../js/utils.js'

  let dagTime, start, resolvedDnsLink, didDoc, subdomain
  let key, val
  let textContent = []

  let isDev = window.location.hostname.includes('localhost')
  let splitHost = window.location.hostname.split('.')

  if ((!isDev && splitHost.length === 3) || (isDev && splitHost.length === 2)) {
    subdomain = splitHost[0]
  }

  $: {
    ;(async () => {
      if ($rootCidStr) textContent = await getIPLDObj($rootCidStr)
    })()
  }

  onMount(async () => {
    rootCidStr.useLocalStorage()
  })

  const handleSubmit = async () => {
    let value = val
    start = Date.now()

    let edits = {}
    edits[key] = await $ipfsNode.dag.put({ value })
    if ($rootCidStr) {
      let previous = await $ipfsNode.dag.get($rootCidStr, { path: '/' })
      let cid = await $ipfsNode.dag.put({ ...previous.value, ...edits })
      $rootCidStr = cid.toBaseEncodedString()
    } else {
      let cid = await $ipfsNode.dag.put({ ...edits })
      $rootCidStr = cid.toBaseEncodedString()
    }

    textContent = await getIPLDObj($rootCidStr)
    dagTime = Date.now() - start
    console.log(dagTime + 'ms')

    if ($rootCidPem) {
      await importKey($ipfsNode, ROOT_CID_PEM, $rootCidPem)
      $ipfsNode.name.publish(`/ipfs/${$rootCidStr}`, {
        resolve: false,
        key: ROOT_CID_PEM,
        lifetime: '87600h',
        ttl: '87600h',
      })

      goPush(
        $rootCidPem,
        process.env.SAPPER_APP_API_URL,
        process.env.SAPPER_APP_WS_URL,
        $rootCidStr,
      )
        .then(() => {
          console.log(`published to go ${Date.now() - start}ms`)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
</script>

<style>
  ul {
    list-style: none;
    text-align: left;
  }
</style>

{#if $ipfsNode}
  {#if $rootCidPem}
    <p>Save some text to IPFS:</p>
    <form on:submit|preventDefault={handleSubmit}>
      <input placeholder="My favorite color" bind:value={key} name="key" />
      <input placeholder="Blue" bind:value={val} name="value" />
      <input type="submit" value="Save" />
    </form>
  {/if}
  {#if $rootCidStr && textContent}
    <br />
    {#if $rootCidStr}
      IPLD Root Hash:
      <a href="https://explore.ipld.io/#/explore/{$rootCidStr}" target="_blank">
        {$rootCidStr}
      </a>
      {#if dagTime}({dagTime}ms){/if}
    {/if}
    <ul>
      {#each [...Object.entries(textContent)] as [k, v]}
        <li>{k}: {v.value}</li>
      {/each}
    </ul>
  {/if}
{/if}
