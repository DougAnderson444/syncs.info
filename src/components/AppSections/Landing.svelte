<script>
  import { fade, fly, slide } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'
  import { spring } from 'svelte/motion'

  import DataTest from './DataTest.svelte'
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
    align-content: center;
    margin: 1em;
    overflow: auto;
  }
    .placeholder,
  .replacement {
    position: absolute;
    top: 15px;
    left: 135px;
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
  .holder {
    width: auto;
    height: 400px;
  }
</style>

<div class="container">
  <center>
    <div class="holder">
      {#if !$ipfsNode}
        <h1>Loading...</h1>
        <div class="placeholder" out:fly={{ y: -500, duration: 750 }}>
          <figure class="below">
            <img class="below" alt="Wait" src="wait-for-it.png" />
            <figcaption>Loading the blockchain in your browser</figcaption>
          </figure>
        </div>
      {:else}
        <h1>Great success!</h1>
        <div style="clear:all;" />
        <div class="replacement" in:fly={{ y: 500, duration: 750 }}>
          <figure>
            <img alt="OK" src="ok.png" />
            <figcaption>You're ready to rock!</figcaption>
          </figure>
        </div>
      {/if}
    </div>
    <div style="clear:all;" />
    {#if $ipfsNode}
      <div>
        <DataTest ipfs={$ipfsNode} />
      </div>
    {/if}
  </center>
</div>
<div style="clear:all;" />
