<script>
  import last from "it-last"; // gets last value of async iterator
  import { onMount } from "svelte";
  import IpfsResolve from "../IpfsResolve.svelte";
  import { getIPLDObj, toCID } from "../../js/ipfsNode";
  import { importKey } from "../../js/ipfsUtils";
  import { goPush } from "../../js/ipnsUtils";
  import { getEncrypted, passwordToIndexedSeed32 } from "../../js/process";
  import ObjectComp from "../Utility/ObjectComp.svelte";
  import DisplayData from "./Display/DisplayData.svelte";

  //svelte stores
  import {
    rootCidStr,
    rootCidPem,
    ipfsNode,
    username,
    password,
    aesKey32
  } from "../../js/stores.js";
  import { DID_DOC_TLD, ROOT_CID_PEM } from "../../js/constants.js";
  import { getDNSLinkFromName } from "../../js/utils.js";

  let dagTime, start, resolvedDnsLink, didDoc, subdomain;
  let key, val;

  passwordToIndexedSeed32($username, $password, 0).then(r => ($aesKey32 = r));

  let isDev = window.location.hostname.includes("localhost");
  let splitHost = window.location.hostname.split(".");

  if ((!isDev && splitHost.length === 3) || (isDev && splitHost.length === 2)) {
    subdomain = splitHost[0];
  }

  onMount(async () => {
    //rootCidStr.useLocalStorage()
  });

  const handleSubmit = async () => {
    start = Date.now();
    const { value, iv } = await getEncrypted(val, $aesKey32);
    let edits = {};
    edits[key] = await $ipfsNode.dag.put({ value, encrypted: true, iv });
    if ($rootCidStr) {
      let previous = await $ipfsNode.dag.get($rootCidStr, { path: "/" });
      let cid = await $ipfsNode.dag.put({ ...previous.value, ...edits });
      $rootCidStr = cid.toBaseEncodedString();
    } else {
      let cid = await $ipfsNode.dag.put({ ...edits });
      $rootCidStr = cid.toBaseEncodedString();
    }

    console.log(`$rootCidStr is now ${$rootCidStr}`);

    dagTime = Date.now() - start;

    // rootCidPem is loaded once the locker is accessed
    if ($rootCidPem) {
      await importKey($ipfsNode, ROOT_CID_PEM, $rootCidPem);
      $ipfsNode.name
        .publish(`/ipfs/${$rootCidStr}`, {
          resolve: true,
          key: ROOT_CID_PEM,
          lifetime: "87600h",
          ttl: "87600h"
        })
        .then(async r => {
          console.log(`Local pub updated, \n${r.value} & \n${r.name}`);
          console.log(`Do a test resolve on /ipns/${r.name}`);
          let resolvedDataSvcLink = await $ipfsNode.resolve(`/ipns/${r.name}`);
          console.log(`Test resolved:`, resolvedDataSvcLink);
        })
        .catch(error => console.log(error));

      goPush(
        $rootCidPem,
        process.env.SAPPER_APP_API_URL,
        process.env.SAPPER_APP_WS_URL,
        $rootCidStr
      )
        .then(() => {
          console.log(`published to go ${Date.now() - start}ms`);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
</script>

<style>

</style>

{#if $ipfsNode}
  {#if $rootCidPem}
    <p>Save some data to sync:</p>
    <form on:submit|preventDefault={handleSubmit}>
      <input
        placeholder="My favorite color"
        bind:value={key}
        name="key"
        disabled={!$aesKey32} />
      <input
        placeholder="Blue"
        bind:value={val}
        name="value"
        disabled={!$aesKey32} />
      <input type="submit" value="Save" />
    </form>
  {/if}
  <div style="clear:all;" />
  <div>
    <DisplayData />
  </div>
{/if}
