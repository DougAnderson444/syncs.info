<script>
  import Card from "@smui/card";

  export let show;
</script>

<style>
  .contain {
    margin: 1em;
    width: 550px;
  }
</style>

{#if show}
  <div class="contain">
    <div class="card-container short">
      <Card
        class="high"
        style="width: 500px; background-color: #fff3cd; border-color: #ffeeba;"
        padded>
        <slot name="phrase">
          <span>⛔️ Unknown error ⛔️</span>
        </slot>
      </Card>
    </div>
  </div>
{/if}
