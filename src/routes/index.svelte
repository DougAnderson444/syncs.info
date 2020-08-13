<script>
  import { appSections } from '../components/AppSections'

  //svelte stores
  import { appSection } from '../js/stores.js'
  import { onMount } from 'svelte'

  let active
  $appSection = 'Landing'
  $: active = appSections[$appSection]

  onMount(async () => {
    
  })
</script>

<svelte:head>
  <title>Syncs.info</title>
</svelte:head>

<div class="content">
  {#if active && $appSection}
    <svelte:component this={active.component} />
  {/if}

</div>