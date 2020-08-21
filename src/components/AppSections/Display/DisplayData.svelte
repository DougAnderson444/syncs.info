<script>
  import { onMount } from 'svelte'
  import { DID_DOC_TLD } from '../../../js/constants.js'
  import { getDNSLinkFromName } from '../../../js/utils.js'
  import last from 'it-last' // gets last value of async iterator

  import { ipfsNode, username } from '../../../js/stores.js'

  export let name = `${$username}.${DID_DOC_TLD}` // default to curret site user
  let resolvedDnsLink, resolvedDataSvcLink, textContent

  onMount(async () => {
    if ($ipfsNode) {
      let dlink = await getDNSLinkFromName(name)
      console.log(`dlink is `, dlink)

      try {
        resolvedDnsLink = await last($ipfsNode.name.resolve(dlink))
        didDoc = await $ipfsNode.dag.get(resolvedDnsLink.replace('/ipfs/', ''))
        /* Need to publish to ipns first! Or this wont resolve to anything */
        try {
          if (didDoc.value) {
            resolvedDataSvcLink = await $ipfsNode.resolve(
              didDoc.value.service[0].serviceEndpoint,
            )
            textContent = await getIPLDObj(resolvedDataSvcLink)
          }
        } catch (error) {
          console.log(`No data saved by this user ${name}\n`, error)
        }
      } catch (error) {
        console.log(error)
      }
    }
  })
</script>

{#if resolvedDataSvcLink}
  Data Link:
  <a
    href="https://explore.ipld.io/#/explore{resolvedDataSvcLink}"
    target="_blank">
    {resolvedDataSvcLink}
  </a>
{/if}
{#if textContent}
  {#each [...Object.entries(textContent)] as [k, v]}
    <li>{k}: {v.value}</li>
  {/each}
{/if}
