<script>
  
  
  import SaveButton from './SaveButton.svelte'
  import { getDNSLinkFromName } from '../js/utils.js'
  import { onMount } from 'svelte'
  import { DID_DOC_TLD } from '../js/constants.js'
  
  import { fly } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'

  //svelte stores
  import { appSection, username, dnsLink } from '../js/stores.js'

  //sapper stores
  import { goto, stores, prefetch } from '@sapper/app'
  
  prefetch("/locker")

  const { page } = stores()

  var regex = /(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,5})/i

  // If not saved, show this bar. Then fade it out.
  export let status = 'hidden' // 'save-bar-container' // turns to Hidden
  export let saveState = ''
  let subdomain

  onMount(async () => {
    // "Saved" if there is a DNSLink pointing to an IPNS hash
    // If there's no DNSLINK, show this bar
    // check DNS link (or fauna db)
    // console.log(`$page.host: ${$page.host}`)
    var count = ($page.host.match(/\./g) || []).length

    subdomain = $page.host.includes(`.${process.env.SAPPER_APP_TLD}`)
      ? $page.host.replace(`.${process.env.SAPPER_APP_TLD}`, '')
      : null
    //chop off the tld

    if (!!subdomain) {
      subdomain = subdomain.replace(`.`, '') //lose the dot
      $username = subdomain
      let str = $page.host.includes('.localhost')
        ? subdomain + `.${DID_DOC_TLD}`
        : $page.host
      console.log(`Getting <${str}> from HTTPS-over-DNS`)
      $dnsLink = await getDNSLinkFromName(str)
      if (!$dnsLink) status = 'save-bar-container'
    }
  })

  $: if (!!$dnsLink) status = 'hidden'

  const savePage = async (e) => {
    // disable the save button, make bar grey
    saveState = 'SAVING'
    
    await goto('/locker');
    //$appSection = 'CreateNewUser'
  }
</script>

<style>
  .hidden {
    display: none;
    visibility: hidden;
  }
  .save-bar-container {
    padding: 16px;
    height: 48px;
    background: #2bbaf8;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .save-bar-container p {
    font-family: Menlo, monospace;
    font-size: 14px;
    color: white;
    font-weight: bold;
    cursor: pointer;
  }
  .edit-link-and-save {
    display: flex;
    align-items: center;
  }
  .edit-link-and-save div {
    margin-right: 16px;
  }
  @media (max-width: 500px) {
    .last-saved {
      width: 205px;
    }
  }
</style>

{#if status != 'hidden'}
<div class={status} transition:fly={{delay: 100, y: 0, duration: 2500, opacity: 0.1, easing: quintOut }}>
  <p class="last-saved" id="save-bar">
    Temporary page. Wanna go steady? Secure this page:
  </p>
  <div class="edit-link-and-save">
    <div>
      <SaveButton on:click={savePage} {saveState} />
    </div>
  </div>
</div>
{/if}