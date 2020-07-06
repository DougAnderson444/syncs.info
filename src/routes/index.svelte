<script>
  import ServiceWorker from '../components/serviceWorker'
  import { fade, fly } from 'svelte/transition'
  import { spring } from 'svelte/motion'

  export let nodeId = false
</script>

<style>
  h1,
  figure,
  p {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  figure {
    margin: 0 0 1em 0;
  }

  img {
    width: 100%;
    max-width: 400px;
    margin: 0 0 1em 0;
  }

  p {
    margin: 1em auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
  .container {
    position: relative;
    width: 400px;
    height: 450px;
    align-content: center;
    margin: auto;
    overflow: auto;
  }
  .placeholder,
  .replacement {
    position: absolute;
    top: 0;
    left: 0;
    margin: auto;
  }
  .replacement {
    z-index: 10;
  }
  figure {
    text-align: center;
    align-content: center;
    margin: auto;
  }
  img {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
</style>

<svelte:head>
  <title>Syncs.info</title>
</svelte:head>

<h1>Great success!</h1>
<div style="clear:all;" />
<div class="container">
  <center>
    {#if !nodeId}
      <div class="placeholder" out:fade>
        <figure class="below">
          <img class="below" alt="Wait" src="wait-for-it.png" />
          <figcaption>Loading...</figcaption>
        </figure>
      </div>
    {:else}
      <div class="replacement" in:fade>
        <figure>
          <img alt="OK" src="ok.png" />
          <figcaption>Have fun as a user syncs.info!</figcaption>
        </figure>
      </div>
    {/if}
  </center>
</div>
<div style="clear:all;" />
<div>
  <p>
    <ServiceWorker bind:nodeId />
  </p>
</div>
