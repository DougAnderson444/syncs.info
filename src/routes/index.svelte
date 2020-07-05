<script>
  import ServiceWorker from '../components/serviceWorker'
  export let nodeId

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
</style>

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<h1>Great success!</h1>

<figure>
  {#if !nodeId}
    <img alt="Wait" src="wait-for-it.png" />
    <figcaption>Loading... wait for it... aaaaand,</figcaption>
  {:else}
    <img alt="OK" src="ok.png" />
    <figcaption>Have fun with Sapper!</figcaption>
  {/if}
</figure>

<p>
  <strong>
    Try editing this file (src/routes/index.svelte) to test live reloading.
  </strong>
</p>

<ServiceWorker bind:nodeId  />
