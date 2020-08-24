<script>
  import { onMount } from "svelte";
  import { getDNSLinkFromName } from "../../../js/utils.js";
  import { getIPLDObj, getRootCidStr } from "../../../js/ipfsNode";
  import { username, rootCidStr, aesKey32 } from "../../../js/stores.js";
  import { DID_DOC_TLD } from "../../../js/constants.js";
  import { getDecrypted } from "../../../js/process";

  export let name = `${$username}.${DID_DOC_TLD}`; // default to curret site user
  let rcs, textContent;

  const triggerCidStr = async cidStr => {
    if (cidStr) textContent = await getIPLDObj(cidStr);
  };

  $: if (name == `${$username}.${DID_DOC_TLD}`) rcs = $rootCidStr; // make it reactive if it's default user being displayed
  $: triggerCidStr(rcs);

  onMount(async () => {
    //rootCidStr.useLocalStorage()
    let dlink = await getDNSLinkFromName(name);
    rcs = await getRootCidStr(dlink);
  });

  const decrypted = async v => {
    return await getDecrypted(v.value, $aesKey32, v.iv);
  };
</script>

<style>
  ul {
    list-style: none;
    text-align: left;
  }
  div {
    margin: 1em;
    padding: 1em;
  }
</style>

<div>
  {#if rcs}
    Data Link:
    <a href="https://explore.ipld.io/#/explore/ipfs/{rcs}" target="_blank">
      {rcs}
    </a>
  {/if}
  {#if textContent}
    <ul>
      {#each [...Object.entries(textContent)] as [k, v]}
        <li>
          {k}:
          {#if v.encrypted}
            {#await decrypted(v)}decrypting...{:then r}{r} (Decrypted){/await}
          {:else}{v.value}{/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>
