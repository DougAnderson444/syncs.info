<script>
  export let saveState
  export let disabled
  $: disabled = !!saveState
</script>

<style>
  button {
    font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-size: 18px;
    background-color: #2ecc40;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    width: 80px;
    height: 36px;
    font-weight: bold;
  }
  .SAVING {
    background-color: #dce92c;
  }
  .SUCCESS {
    background-color: purple;
  }
  .ERROR {
    background-color: #ec0062;
  }
</style>

<button {disabled} class={saveState}>
  {#if saveState == 'SAVING'}
    ⏳
  {:else if saveState == 'ERROR'}
    ❌
  {:else if saveState == 'SUCCESS'}🎉{:else}SAVE{/if}
</button>
