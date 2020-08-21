<script>
  import last from "it-last"; // gets last value of async iterator
  import { onMount } from "svelte";
  import {
    wallet,
    rootCidPem,
    rootCidStr,
    ipfsNode,
    username,
    dnsLink
  } from "../../js/stores.js";
  import { getDNSLinkFromName } from "../../js/utils.js";
  import { DID_DOC_TLD, ROOT_CID_PEM } from "../../js/constants.js";
  import ObjectComp from "../Utility/ObjectComp.svelte";
  import DataTest from "../AppSections/DataTest.svelte";

  let cid, nodeId, dagTime, start, resolvedDnsLink, didDoc, resolvedDataSvcLink;
  let i = 0;
  let key, value;
  let textContent = {};

  const getDidData = async () => {
    console.log(`get Did Data`)
    if ($ipfsNode) {
      $dnsLink = await getDNSLinkFromName(`${$username}.${DID_DOC_TLD}`);

      try {
        resolvedDnsLink = await last($ipfsNode.name.resolve($dnsLink));
        didDoc = await $ipfsNode.dag.get(resolvedDnsLink.replace("/ipfs/", ""));
        /* Need to publish to ipns first! Or this wont resolve to anything */
        if (didDoc.value && $rootCidStr)
          resolvedDataSvcLink = await $ipfsNode.resolve(
            didDoc.value.service[0].serviceEndpoint
          );
      } catch (error) {
        console.log(error);
      }
    }
  };

  onMount(async () => {
    username.useLocalStorage();

    $rootCidPem = await $wallet.locker.getValue(ROOT_CID_PEM); // $rootCidPem is username + password + index=1

    getDidData()
  });
</script>

Locker Contents
<br />
{#if $username}
  <ul>
    <li>
      Username
      <b>{$username}.{DID_DOC_TLD}</b>
    </li>
    <li>
      DNSLink:
      <b>dnslink=/ipns/{$dnsLink}</b>
    </li>
    {#if resolvedDnsLink}
      <li>
        Latest DID Doc:
        <b>
          <a
            href="https://explore.ipld.io/#/explore{resolvedDnsLink}"
            target="_blank">
            {resolvedDnsLink}
          </a>
        </b>
      </li>
    {/if}
    {#if didDoc}
      <li>
        Your Digital Identity Document:
        <br />
        <ObjectComp key="DID Document" val={didDoc.value} />
      </li>
      <li>
        DataHub:
        <b>{didDoc.value.service[0].serviceEndpoint}</b>
      </li>
    {/if}
    {#if resolvedDataSvcLink}
      <li>
        DataHub Data:
        <b>
          <a
            href="https://explore.ipld.io/#/explore{resolvedDataSvcLink}"
            target="_blank">
            {resolvedDataSvcLink}
          </a>
        </b>
      </li>
    {/if}

    <!--
    <li>
      Root CID pem:
      <br />
      {$rootCidPem}
    </li>
    -->
  </ul>
{/if}
<DataTest />
