<script>
  import last from 'it-last' // gets last value of async iterator
  import { onMount } from 'svelte'
  import IpfsResolve from '../IpfsResolve.svelte'
  import { goPush } from '../../js/ipnsUtils'
  import { getData } from '../../js/utils'
  import { importKey } from '../../js/ipfsUtils'
  import { getIPLDObj } from '../../js/ipfsNode'
  import ObjectComp from '../Utility/ObjectComp.svelte'

  //svelte stores
  import {
    wallet,
    rootCid,
    rootCidPem,
    ipfsNode,
    username,
    serviceEndpoint,
    dnsLink,
  } from '../../js/stores.js'
  import { DID_DOC_TLD, ROOT_CID_PEM } from '../../js/constants.js'
  import { getDNSLinkFromName } from '../../js/utils.js'

  let nodeId, dagTime, start, resolvedDnsLink, didDoc, subdomain
  let key, val
  let textContent = []

  let isDev = window.location.hostname.includes('localhost')
  let splitHost = window.location.hostname.split('.')

  if ((!isDev && splitHost.length === 3) || (isDev && splitHost.length === 2)) {
    subdomain = splitHost[0]
  }

  onMount(async () => {
    rootCid.useLocalStorage()
    console.log('$rootCid', $rootCid)

    nodeId = await $ipfsNode.id() //works
    if ($dnsLink)
      getData($ipfsNode, subdomain)
        .then((res) => {
          $rootCid = res.cid.toBaseEncodedString()
          textContent = res.data
        })
        .catch((err) => console.log(err))
  })

  $: {
    ;(async () => {
      if ($rootCid) textContent = await getIPLDObj($rootCid)
    })()
  }

  const handleSubmit = async () => {
    let value = val
    start = Date.now()
    console.log('$rootCid', $rootCid)
    let edits = {}
    edits[key] = await $ipfsNode.dag.put({ value })
    if ($rootCid) {
      let previous = await $ipfsNode.dag.get($rootCid, { path: '/' })
      $rootCid = (
        await $ipfsNode.dag.put({ ...previous.value, ...edits })
      ).toBaseEncodedString()
    } else {
      $rootCid = (await $ipfsNode.dag.put({ ...edits })).toBaseEncodedString()
    }
    console.log(`$rootCid: `, $rootCid)
    textContent = await getIPLDObj($rootCid)
    console.log('textContent', textContent)
    dagTime = Date.now() - start
    console.log(dagTime + 'ms')

    // check if wallet.isLocked
    // on cid change, push it to go-IPFS Node
    // Push it to the goIpfs node network
    if ($rootCidPem) {
      console.log('$rootCidPem', $rootCidPem)
      await importKey($ipfsNode, ROOT_CID_PEM, $rootCidPem)
      $ipfsNode.name
        .publish(`/ipfs/${$rootCid}`, {
          resolve: false,
          key: ROOT_CID_PEM,
        })
        .then((results) => {
          console.log(`Local Publish`, results)
        })

      goPush(
        $rootCidPem,
        process.env.SAPPER_APP_API_URL,
        process.env.SAPPER_APP_WS_URL,
        $rootCid,
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
      $rootCid = await $ipfsNode.files.flush('/')
    } catch (err) {
      console.log(err)
    }
  }
</script>

<style>
  ul {
    list-style: none;
    text-align: left
  }
</style>

{#if nodeId}
  {#await nodeId then nodeId}
    <!--    NodeId: {nodeId} <br /> -->
    {#if $rootCidPem || !$dnsLink}
      <p>Save some text to IPFS:</p>
      <form on:submit|preventDefault={handleSubmit}>
        <input placeholder="My favorite color" bind:value={key} name="key" />
        <input placeholder="Blue" bind:value={val} name="value" />
        <input type="submit" value="Save" />
      </form>
    {/if}
    {#if textContent && $rootCid}
      <br />
      {#if $rootCid}
        IPLD Root Hash:
        <a href="https://explore.ipld.io/#/explore/{$rootCid}" target="_blank">
          {$rootCid}
        </a>
        ({dagTime})
      {/if}
      <ul>
        <!--ObjectComp key="Contents" val={textContent} expanded="true" /-->
        {#each [...Object.entries(textContent)] as [k, v]}
          <li>{k}: {v.value}</li>
        {/each}
      </ul>
    {/if}

  {/await}
{/if}
