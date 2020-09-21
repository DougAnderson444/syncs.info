<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let saveState;
  export let disabled;
  $: disabled = !!saveState;
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
    background-color: rgb(173, 173, 173);
  }
  .SUCCESS {
    background-color: purple;
  }
  .ERROR {
    background-color: #ec0062;
  }
</style>

<button
  {disabled}
  class={saveState}
  on:click={() => dispatch('click')}
  id="save-button">
  {#if saveState == 'SAVING'}
    ⏳
  {:else if saveState == 'ERROR'}
    ❌
  {:else if saveState == 'SUCCESS'}🎉{:else}SAVE{/if}
</button>
