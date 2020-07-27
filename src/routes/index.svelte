<script>
  import { appSections } from '../components/AppSections'

  //svelte stores
  import { appSection } from '../js/stores.js'

  let active

  $appSection = 'Landing'
  $: active = appSections[$appSection]
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
  <svelte:component this={active.component} />
</div>
