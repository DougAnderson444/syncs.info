<script>
  import { onMount } from "svelte";
  import Hyper from "hyper-svelte-component";

  let log = "";
  let wellKnown = "";
  let mounted, hyperSDK

  onMount(async () => {

    mounted = true
  });

</script>

<style>
  .tiny {
    font-size: 0.7rem;
    margin: 1em;
    padding: 1em;
  }
</style>

<div class="tiny">
  {#if mounted}
  Mounted. Load SDK.
    <Hyper bind:SDK={hyperSDK} />
  {/if}

  {#if log}
    {@html log}
  {/if}
</div>
