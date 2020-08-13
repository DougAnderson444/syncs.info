<script>
  import last from 'it-last' // gets last value of async iterator
  import { onMount } from 'svelte'
  import { wallet, rootCidPem, ipfsNode, username } from '../../js/stores.js'
  import { getDNSLinkFromName } from '../../js/utils.js'
  import { DID_DOC_TLD, ROOT_CID_PEM } from '../../js/constants.js'
  import ObjectComp from '../Utility/ObjectComp.svelte'

  let cid,
    nodeId,
    dagTime,
    start,
    dnsLink,
    resolvedDnsLink,
    didDoc,
    resolvedDataSvcLink
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
        didDoc = await $ipfsNode.dag.get(
          resolvedDnsLink.replace('/ipfs/', ''), // new CID(resolvedDnsLink)
          {
            localResolve: true,
          },
        )
        /* Need to publish to ipns first!
        try {
          console.log(
            `Resolving Data serviceEndpoint `,
            didDoc.value.service[0].serviceEndpoint,
          )
          resolvedDataSvcLink = await last(
            $ipfsNode.name.resolve(didDoc.value.service[0].serviceEndpoint),
          )
          console.log('resolvedDataSvcLink', resolvedDataSvcLink)
        } catch (error) {
          console.log(error)
        }
        */
      } catch (error) {
        console.log(error)
      }
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
    <li>
      resolvedDataSvcLink:
      <a
        href="https://explore.ipld.io/#/explore/{resolvedDataSvcLink}"
        target="_blank">
        {resolvedDataSvcLink}
      </a>
    </li>
  </ul>
{/if}
