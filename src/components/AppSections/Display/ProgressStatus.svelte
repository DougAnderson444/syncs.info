<script>
  import Spinner from './Spinner.svelte'
  import { Icon } from '@smui/common'
  export let awaiting
  // false, then promise, then resolved value
</script>

<style>
  .progress {
    position: relative;
    top: 0.35em;
    left: 0;
  }
</style>

<span class="progress">
  {#if !awaiting}
    <Icon class="material-icons" style="margin-right: 4px; color: #ddd;">
      pending
    </Icon>
  {:else}
    <Icon class="material-icons" style="margin-right: 4px; color: green;">
      check_circle
    </Icon>
  {/if}
</span>
<slot name="before">
  <span></span>
</slot>

{#if awaiting}
  {#await awaiting then awaiting}
    <slot name="complete">
      <div></div>
    </slot>
  {/await}
{/if}
<br />
