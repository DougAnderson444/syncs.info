<script>
  import SaveButton from './SaveButton.svelte'
  import { getDNSLinkFromName } from '../js/utils.js'
  import { onMount } from 'svelte'

  //svelte stores
  import { appSection, username } from '../js/stores.js'

  //sapper stores
  import { stores } from '@sapper/app'
  const { page } = stores()

  var regex = /(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,5})/i

  // If not saved, show this bar. Then fade it out.
  export let status = 'hidden' // 'save-bar-container' // turns to Hidden
  export let saveState = ''
  let subdomain

  onMount(() => {
    var parts = window.location.hostname.split('.')
    var subdomain1 = parts.shift()
    var upperleveldomain = parts.join('.')

    console.log(`host: ${$page.host}`)
    // "Saved" if there is a DNSLink pointing to an IPNS hash
    // If there's no DNSLINK, show this bar
    // check DNS link (or fauna db)
    console.log(`$page.host: ${$page.host}`)
    var count = ($page.host.match(/\./g) || []).length

    subdomain = $page.host.includes(`.${process.env.SAPPER_APP_TLD}`)
      ? $page.host.replace(`.${process.env.SAPPER_APP_TLD}`, '')
      : null
    //chop off the tld

    if (!subdomain) status = 'hidden'
    else {
      console.log(`subdomain: ${subdomain}`)
      subdomain = subdomain.replace(`.`, '') //lose the dot
      ;(async () => {
        let str = $page.host.includes('.localhost')
          ? subdomain + '.syncs.info'
          : $page.host
        console.log(`Getting <${str}> from HTTPS-over-DNS`)
        let link = await getDNSLinkFromName(str)
        if (link) status = 'hidden'
        else status = 'save-bar-container'
      })()
    }
  })

  const savePage = async (e) => {
    // disable the save button, make bar grey
    saveState = 'SAVING'
    $username = subdomain
    // show the password page
    $appSection = 'CreateNewUser'

    // prompt for a password
    // create identity
    // publish to IPNS
    // show IPNS link
    // and show backup phrases/link device?
    // show some basic sync component, widget, sssssss?
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

<!-- Put a banner here: Temporary page! Wanna go steady? Secure this page  -->

<div class={status}>
  <p class="last-saved">Temporary page. Wanna go steady? Secure this page:</p>
  <div class="edit-link-and-save">
    <div>
      <SaveButton on:click={savePage} {saveState} />
    </div>
  </div>
</div>
