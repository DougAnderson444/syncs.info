<script>
  export let searchState;
  export let disabled;
  $: disabled = !!searchState;
</script>

<style>
  button {
    font-size: 18px;
    background-color: #2ecc40;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
  }
  .SEARCHING {
    background-color: #dce92c;
  }
  .NETWORK_ERROR {
    background-color: #aaa;
  }
  .ERROR {
    background-color: #ec0062;
  }
</style>

<button {disabled} class={searchState}>
  {#if searchState == 'SEARCHING'}
    ⏳
  {:else if searchState == 'NETWORK_ERROR'}❌{:else}→{/if}
</button>
