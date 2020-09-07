<script>
  import { backgroundComponents } from "../../js/stores.js";
  import { lockerSections } from "./index.js";

  $backgroundComponents = [
    ...$backgroundComponents,
    lockerSections["CreateIdentity"],
    lockerSections["CreateDNSLink"],
    lockerSections["CreateDatabaseEntry"],
    lockerSections["CreateDataServiceEntry"]
  ];
</script>

<style>

</style>

Creating details:
<br />
{#if $backgroundComponents && $backgroundComponents.length > 0}
  {#each $backgroundComponents as background}
    <svelte:component this={background.component} />
  {/each}
{/if}
