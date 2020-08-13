<script>
  import { onMount } from 'svelte'
  import { wallet, rootCidPem, ipfsNode, username } from '../../js/stores.js'
  import { getDNSLinkFromName } from '../../js/utils.js'
  import { DID_DOC_TLD, ROOT_CID_PEM } from '../../js/constants.js'

  let cid, nodeId, dagTime, start, dnsLink, resolvedDnsLink, didDoc
  let i = 0
  let key, value
  let textContent = {}

  onMount(async () => {
    username.useLocalStorage();

    $rootCidPem = $wallet.locker.getValue(ROOT_CID_PEM) // $rootCidPem is username + password + index=1

    if ($rootCidPem && $ipfsNode) {
      console.log(`rootCidPem \n`, $rootCidPem)
      dnsLink = await getDNSLinkFromName(`${$username}.${DID_DOC_TLD}`)
      console.log(`dnsLink`, dnsLink)
      try {
        resolvedDnsLink = $ipfsNode.resolve(dnsLink)
        didDoc = $ipfsNode.dag.get(resolvedDnsLink) //getDidDoc
      } catch (error) {}
    }
  })
</script>
Locker Contents

<br />
{#if $username}
  <ul>
    <li>Username {$username}</li>
    <li>DNSLink (dnslink=): {dnsLink}</li>
    <li>
      Latest DID Doc :
      <a
        href="https://explore.ipld.io/#/explore/{resolvedDnsLink}"
        target="_blank">
        {resolvedDnsLink}
      </a>
    </li>
    <!--
  <ul>
    {#each [...Object.entries(didDoc)] as line}{line}{/each}
  </ul>
  -->
    <li>DataHub:</li>
  </ul>
{/if}
