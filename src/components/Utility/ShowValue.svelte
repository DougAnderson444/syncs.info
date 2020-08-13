<script>
  import EditableText from "./EditableText.svelte";
  import { root, ipfsNode } from "./stores.js";
  import { saveDeepValue } from "./utils.js";
  import IPFS from "ipfs";

  export let val;
  export let breadcrumbs = [];
  let isCID = false;

  // preprocess value
  if (IPFS.isIPFS.cid(val)) {
    // content ID, link it to the data
    isCID = true;
    // grab the data
    (async () => {
      // dag.get returns an IPLD format node
      let contactsData = (await $ipfsNode.dag.get(val)).value;
      //console.log(`New portfolio is ${JSON.stringify($root)}`)
    })();
  }

  // need an "on done editing" event to fire from EditableText
  function saveValue() {
    console.log(`Saving: ${val} to crumbs: ${breadcrumbs}`);
    saveDeepValue($root, breadcrumbs, val);
    $root = $root;
    console.log(`new root is ${JSON.stringify($root, null, 2)}`);
  }
</script>

{#if isCID}
  <a
    target="_blank"
    rel="noopener noreferrer"
    href="https://explore.ipld.io/#/explore/{val}">
    <EditableText bind:value={val} on:doneEditing={saveValue} />
  </a>
{:else}
  <EditableText bind:value={val} on:doneEditing={saveValue} />
{/if}
