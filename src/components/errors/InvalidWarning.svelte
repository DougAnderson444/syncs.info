<script>
  import Card from "@smui/card";

  export let validation;

  if (validation.error) {
    console.error(`Validation ERROR!! ${error}`);
  }
</script>

<style>
  .contain {
    margin: 1em;
    width: 550px;
  }
</style>

<div class="contain">
{#if validation && validation.error}
  <div class="card-container short">
    <Card
      class="high"
      style="width: 500px; background-color: #fff3cd; border-color: #ffeeba;"
      padded>
      <span>⛔️ Passphrase is not strong enough ⛔️</span>
      {#if validation.warning}
        <div>
          <h4>Warning ⚠️</h4>
          <div>{validation.warning.message}</div>
        </div>
      {/if}
      {#if validation.suggestions && validation.suggestions.length > 0}
        <div>
          <h4>Suggestions 📖</h4>
          {#each validation.suggestions as suggestion, i}
            <li>{i + 1}: {suggestion.message}</li>
          {/each}
        </div>
      {/if}
    </Card>
  </div>
{/if}
</div>
