<script>
  import { onMount } from "svelte";
  import SDK from "dat-sdk"
  
  onMount(async () => {
    const sdk = await SDK();
    const { Hypercore, Hyperdrive, resolveName, close } = sdk;

    
  });
</script>
