<script>
  import Nav from '../components/Nav.svelte'
  import IPFSComp from '../components/IPFSComp.svelte'
  import { onMount } from 'svelte'

  export let segment
  let mounted
  onMount(async () => {
    mounted = true
  })
</script>

<style>
  main {
    position: relative;
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>

{#if mounted}
  <Nav {segment} />

  <main>
    <slot />
  </main>
{/if}
<IPFSComp />