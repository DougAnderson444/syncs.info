<script>
  import { onMount } from "svelte";
  import KappaChat from "../components/KappaChat.svelte";
  import HyperId from "../components/HyperId.svelte";
  let mounted = false;
  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>About Syncs.Info</title>
</svelte:head>

<h1>About syncs.info</h1>

<p>This site allows you to sync your info amongst your peers.</p>
<p>Your data, your way.</p>
<p>Syncs.info is about connecting your data, not collecting your data.</p>
<p>
  Github:
  <a href="https://github.com/DougAnderson444/syncs.info" target="_blank">
    https://github.com/DougAnderson444/syncs.info
  </a>
</p>
<br />
Here's an example Chat App you can use syncs.info for:
<br />
<KappaChat />
<!--br />
HyPNS
<br />
{#if mounted}
  <HyperId />
{/if}
-->
