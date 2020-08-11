<script>
  import { fade, fly, slide } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'
  import { spring } from 'svelte/motion'

  import DataTest from '../DataTest.svelte'
  //svelte stores
  import { ipfsNode } from '../../js/stores.js'
</script>

<style>
  h1,
  figure {
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
  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
  .container {
    position: relative;
    width: 400px;
    height: 600px;
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

<div class="container">
  <center>
    {#if !$ipfsNode}
      <h1>Loading...</h1>
      <div class="placeholder" out:fade={{ duration: 500 }}>
        <figure class="below">
          <img class="below" alt="Wait" src="wait-for-it.png" />
          <figcaption>Loading the blockchain in your browser</figcaption>
        </figure>
      </div>
    {:else}
      <h1>Great success!</h1>
      <div style="clear:all;" />
      <div class="replacement" in:fade={{ duration: 1500 }}>
        <figure>
          <img alt="OK" src="ok.png" />
          <figcaption>Save and sync your data!</figcaption>
        </figure>
        <DataTest ipfs={$ipfsNode} />
      </div>
    {/if}
  </center>
</div>
