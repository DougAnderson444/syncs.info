<script>
  import SaveButton from './SaveButton.svelte'
  import { getDNSLinkFromName } from '../js/utils.js'

  import { onMount } from 'svelte'
  import { stores } from '@sapper/app'

  const { page } = stores()

  var regex = /(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,5})/i

  // If not saved, show this bar. Then fade it out.
  export let status = 'hidden' // 'save-bar-container' // turns to Hidden
  export let host

  onMount(() => {
    console.log(`host: ${$page.host}`)
    // "Saved" if there is a DNSLink pointing to an IPNS hash
    // If there's no DNSLINK, show this bar
    // check DNS link (or fauna db)
    let subdomain = $page.host.includes('.localhost')
      ? $page.host.split(/_(.+)/)[0]
      : $page.host.match(regex) && $page.host.match(regex)[1] //chop off the tld

    if (!subdomain) status = 'hidden'
    else {
      console.log(`subdomain: ${subdomain}`)
      subdomain = subdomain.replace(`.`, '') //lose the dot
      ;(async () => {
        let str = host.hostname
          ? subdomain + '.' + host.hostname
          : subdomain + '.syncs.info'
        console.log(`Getting <${str}> from cloudflare`)
        let link = await getDNSLinkFromName(str)
        console.log('DNSLink is ' + link)
        if (link) status = 'hidden'
        else status = 'save-bar-container'
      })()
    }
  })
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
      <SaveButton />
    </div>
  </div>
</div>
