<script>
  import last from 'it-last' // gets last value of async iterator
  import { onMount } from 'svelte'
  import { wallet, rootCidPem, ipfsNode, username } from '../../js/stores.js'
  import { getDNSLinkFromName } from '../../js/utils.js'
  import { DID_DOC_TLD, ROOT_CID_PEM } from '../../js/constants.js'
  import ObjectComp from '../Utility/ObjectComp.svelte'

  let cid, nodeId, dagTime, start, dnsLink, resolvedDnsLink, didDoc
  let i = 0
  let key, value
  let textContent = {}

  onMount(async () => {
    username.useLocalStorage()

    $rootCidPem = $wallet.locker.getValue(ROOT_CID_PEM) // $rootCidPem is username + password + index=1

    if ($rootCidPem && $ipfsNode) {
      dnsLink = await getDNSLinkFromName(`${$username}.${DID_DOC_TLD}`)
      console.log(`dnsLink`, dnsLink)
      try {
        resolvedDnsLink = await last($ipfsNode.name.resolve(dnsLink))
        console.log(`/ipns/resolvedDnsLink`, resolvedDnsLink)
        console.log(`resolvedDnsLink`, resolvedDnsLink.replace('/ipfs/', ''))
        didDoc = await $ipfsNode.dag.get(
          resolvedDnsLink.replace('/ipfs/', ''), // new CID(resolvedDnsLink)
          {
            localResolve: true,
          },
        ) //getDidDoc
        console.log(`didDoc`, didDoc.value)
      } catch (error) {}
    }
  })
</script>

Locker Contents
<br />
{#if $username}
  <ul>
    <li>
      Username
      <b>{$username}</b>
    </li>
    <li>
      DNSLink (dnslink=):
      <b>{dnsLink}</b>
    </li>
    <li>
      Latest DID Doc:
      <b>
        <a
          href="https://explore.ipld.io/#/explore/{resolvedDnsLink}"
          target="_blank">
          {resolvedDnsLink}
        </a>
      </b>
    </li>
    {#if didDoc}
      <li>
        DiD Doc:
          <br />
          <ObjectComp key="DID Document" val={didDoc.value} />
      </li>
      <li>DataHub:{didDoc.value.service[0].serviceEndpoint}</li>
    {/if}
  </ul>
{/if}
