<script>
  import Nav from "../components/Nav.svelte";
  import IPFSComp from "../components/IPFSComp.svelte";
  import HyperComponent from "hyper-svelte-component";
  import { onMount } from "svelte";
  //svelte stores
  import { makeDrives, makeCores } from "../js/stores.js";

  export let segment;
  let mounted;
  onMount(async () => {
    mounted = true;
  });
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

  <!--IPFSComp /-->
  <!-- HyperComponent SDK={window.datSDK} bind:Hyperdrive={$makeDrives} bind:Hypercore={$makeCores} /-->
{/if}
