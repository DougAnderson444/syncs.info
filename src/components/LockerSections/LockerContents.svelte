<script>
  import last from 'it-last' // gets last value of async iterator
  import { onMount } from 'svelte'
  import { wallet, rootCidPem, ipfsNode, username, serviceEndpoint } from '../../js/stores.js'
  import { getDNSLinkFromName } from '../../js/utils.js'
  import { DID_DOC_TLD, ROOT_CID_PEM } from '../../js/constants.js'
  import ObjectComp from '../Utility/ObjectComp.svelte'
  import DataTest from '../AppSections/DataTest.svelte'

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
    serviceEndpoint.useLocalStorage()
    
    $rootCidPem = await $wallet.locker.getValue(ROOT_CID_PEM) // $rootCidPem is username + password + index=1

    if ($rootCidPem && $ipfsNode) {
      dnsLink = await getDNSLinkFromName(`${$username}.${DID_DOC_TLD}`)

      try {
        resolvedDnsLink = await last($ipfsNode.name.resolve(dnsLink))
        console.log('resolvedDnsLink', resolvedDnsLink)
        didDoc = await $ipfsNode.dag.get(resolvedDnsLink.replace('/ipfs/', ''))
        console.log('didDoc', didDoc)
        /* Need to publish to ipns first! Or this wont resolve to anything */
        if (didDoc.value)
          resolvedDataSvcLink = await $ipfsNode.resolve(
            didDoc.value.service[0].serviceEndpoint,
          )
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
    {#if resolvedDnsLink}
      <li>
        Latest DID Doc:
        <b>
          <a
            href="https://explore.ipld.io/#/explore{resolvedDnsLink}"
            target="_blank">
            {resolvedDnsLink}
          </a>
        </b>
      </li>
    {/if}
    {#if didDoc}
      <li>
        DiD Doc:
        <br />
        <ObjectComp key="DID Document" val={didDoc.value} />
      </li>
      <li>DataHub:{didDoc.value.service[0].serviceEndpoint}</li>
    {/if}
    {#if resolvedDataSvcLink}
      <li>
        DataHub Data:
        <a
          href="https://explore.ipld.io/#/explore{resolvedDataSvcLink}"
          target="_blank">
          {resolvedDataSvcLink}
        </a>
      </li>
    {/if}

    <!--
    <li>
      Root CID pem:
      <br />
      {$rootCidPem}
    </li>
    -->
  </ul>
{/if}
<DataTest />