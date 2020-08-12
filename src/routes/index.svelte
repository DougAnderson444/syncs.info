<script>
  import { appSections } from '../components/AppSections'
  // Choose either IPFS in service worker, or as a component in the Browser context
  //import ServiceWorkerComp from '../components/AppSections/SubComp/ServWorkerComp.svelte'
  import IPFSComp from '../components/IPFSComp.svelte'

  //svelte stores
  import { appSection } from '../js/stores.js'
  import { onMount } from 'svelte'

  // $appSection = 'Landing'
  $: active = appSections[$appSection]

  let username
  let active

  onMount(async () => {
    let isDev = window.location.hostname.includes('localhost')
    let splitHost = window.location.hostname.split('.')

    if (
      (!isDev && splitHost.length === 3) ||
      (isDev && splitHost.length === 2)
    ) {
      username = splitHost[0]
    }
    $appSection = 'Landing'
  })
</script>

<svelte:head>
  <title>Syncs.info</title>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/icon?family=Material+Icons" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto+Mono" />
</svelte:head>

<div class="content">
  {#if $appSection}
    <svelte:component this={active.component} />
  {/if}
  {#if username}
    <!-- Only load IPFS if it's a subdomain in use -->
    <IPFSComp {username} />
    <!-- ServiceWorkerComp / -->
  {/if}
</div>
