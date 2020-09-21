<script>
  import { onMount } from "svelte";
  import HyperComponent from "hyper-svelte-component";
  import ObjectComp from "./Utility/ObjectComp.svelte";
  import createDidHyper, { getDid } from "js-did-hyper";
  const once = require("events.once"); // polyfill for nodejs events.once in the browser
  //const { once } = require("events"); //doesn't work, need the polyfill for browsers

  //const RAI = require("random-access-idb");
  //var storage = RAI("some-hyper-storage");

  //export let SDK; // passed from App.svelte, which comes from window.datSDK in index.html
  export let makeDrives; // passed from <Hyperdrive > binding
  export let makeDriveCopies;

  let hyperId, mountKey;
  let dougsDrive, rangersDrive;
  let dougsDid, rangersDid;
  let copyDrive;
  let promise1 = new Promise((resolve, reject) => {});
  let promise2 = new Promise((resolve, reject) => {});
  let promise3 = new Promise((resolve, reject) => {});

  let did,
    resolveSelfContents,
    initialContents,
    updatedContents,
    drive,
    key,
    buddy,
    peerDid,
    disabled;

  onMount(async () => {
    // This will run your code
  });

  // make a couple of named drives
  const makeEm = async () => {
    console.log("make 'em cowboy'...");
    dougsDrive = makeDrives("Doug");
    promise1 = await dougsDrive.ready();

    rangersDrive = makeDrives("Ranger");
    promise2 = await rangersDrive.ready();

    // try a copy
    copyDrive = makeDriveCopies(dougsDrive.key);
    promise3 = await copyDrive.ready();

    // Wait for the connection to be made
    if (!copyDrive.peers.length) {
      console.log("no peers yet, waiting for them...");
      copyDrive.on("peer-open", peer => {
        console.log(
          "A) Connected to peer",
          peer.remotePublicKey.toString("hex")
        );
      });
      const [peer] = await once(copyDrive, "peer-open"); //timeout?
      console.log(
        "B) Connected to peer:: ",
        peer.remotePublicKey.toString("hex")
      );
    }

    doDid();
  };

  const doDid = async () => {
    try {
      // use that drive to make a hyperId
      hyperId = createDidHyper(makeDrives);

      const createOps = document => {
        document.addPublicKey({
          id: "master",
          type: "RsaVerificationKey2018",
          publicKeyPem: "master.publicKey"
        });
      };
      try {
        initialContents = await hyperId.create(dougsDrive, createOps);
      } catch (error) {
        console.error(error);
      }

      const updateOps = document => {
        document.addPublicKey({
          id: "secondary",
          type: "RsaVerificationKey2018",
          publicKeyPem: "secondary.publicKey"
        });
      };

      try {
        updatedContents = await hyperId.update(dougsDrive, updateOps);
      } catch (error) {
        console.error(error);
      }
      // get the DID of this hyperId
      did = await getDid(dougsDrive);

      // get the DID Doc of this DID (if possible)
      resolveSelfContents = await hyperId.resolve(did);
    } catch (error) {
      if (error.code === "INVALID_DOCUMENT") {
        throw error;
      }
      if (error.code === "INVALID_DID") {
        throw error;
      }
      console.log(error);
    }
  };

  // once makeDrives is ready, trigger make'em
  $: if (makeDrives) makeEm();

  const handleSubmit = async () => {
    if (peerDid && peerDid.length > 64) {
      disabled = true;
      buddy = "";
      const resolveBuddyContents = await hyperId.resolve(peerDid);
      buddy = resolveBuddyContents;
      disabled = false;
    }
  };

  const handleMount = async () => {
    if (mountKey && mountKey.length == 64) {
      disabled = true;

      dougsDrive.mount("mount", Buffer.from(mountKey, "hex"), err => {
        if (err) throw err;
        dougsDrive.readdir("/", { recursive: true }, (err, dirs) => {
          console.log(dirs);
        });
        dougsDrive.readFile("mount/did-doc-hyper.txt", (err, file) => {
          console.log(file); //"utf8",
        });
      });

      disabled = false;
    }
  };
</script>

<style>
  main {
    text-align: left;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<HyperComponent
  SDK={window.datSDK}
  bind:Hyperdrive={makeDrives}
  sdkOpts={{ persist: true }} />
<HyperComponent SDK={window.datSDK} bind:Hyperdrive={makeDriveCopies} />
<main>
  <h1>Demo the HyperDid!</h1>
  <p>This is a basic demo of how to interact with js-did-hyper.</p>
  <p>
    We've made the following drives from the dat-SDK
    <br />
    <br />
    {#if dougsDrive}
      {#await promise1}
        Loading Doug's Drive
      {:then resolved}
        Doug's Drive: {dougsDrive.key.toString('hex')}
        <br />
        Writable?{dougsDrive.writable}
        <br />
      {:catch error}
        <!-- promise was rejected -->
        <p>Something went wrong: {error.message}</p>
      {/await}
    {/if}
    <br />
    <br />
    {#if rangersDrive}
      {#await promise2}
        Loading Ranger's Drive
      {:then resolved}
        Ranger's Drive: {rangersDrive.key.toString('hex')}
      {:catch error}
        <!-- promise was rejected -->
        <p>Something went wrong: {error.message}</p>
      {/await}
    {/if}
  </p>
  <p>
    {#if dougsDid}
      {#await dougsDid}
        Loading Ranger's Drive
      {:then resolved}
        Ranger's Drive: {dougsDid}
      {:catch error}
        <!-- promise was rejected -->
        <p>Something went wrong: {error.message}</p>
      {/await}
    {/if}
  </p>
  <p>
    {#if copyDrive}
      {#await promise3}
        Loading Copy of Doug's Drive
      {:then resolved}
        Copy's Drive: {copyDrive.key.toString('hex')} (matches Doug: {copyDrive.key.toString('hex') == dougsDrive.key.toString('hex')})
        <br />
        Writable: {copyDrive.writable}
      {:catch error}
        <!-- promise was rejected -->
        <p>Something went wrong: {error.message}</p>
      {/await}
    {/if}
  </p>
  {#if initialContents}
    <p>
      Created initial contents
      <br />
      <ObjectComp
        val={initialContents}
        key="Initial Contents (Click to expand)" />
    </p>
  {/if}
  {#if updatedContents}
    <p>
      Updated to contents:
      <br />
      <ObjectComp
        val={updatedContents}
        key="Updated Contents (Click to expand)" />
    </p>
  {/if}
  {#if did}
    <p>
      Get the DID of this drive:
      <br />
      {did}
    </p>
  {/if}
  {#if resolveSelfContents}
    <p>
      Resolve the content from that DID:
      <br />
      <ObjectComp
        val={resolveSelfContents}
        key="Resolved Contents (Click to expand)" />
    </p>
    <p>
      ...which should be the same as the last update: {JSON.stringify(resolveSelfContents) == JSON.stringify(updatedContents)}
    </p>
  {/if}
  <div>
    <form class="form" on:submit|preventDefault={handleSubmit}>
      Get a peer's DID Doc (enter their did:hyper:abc123abc123...):
      <br />
      <input
        type="text"
        on:click|preventDefault={handleSubmit}
        bind:value={peerDid}
        {disabled} />
    </form>
  </div>
  {#if disabled}Loading... just a second...{/if}
  {#if buddy}
    <p>
      Show Buddy's DID Doc Content:
      <br />
      <ObjectComp
        val={buddy}
        key="Resolved Contents from Peer (Click to expand)" />

    </p>
  {/if}

  <div>
    <form class="form" on:submit|preventDefault={handleMount}>
      Mount a peer's drive (enter their key: abc123abc123...):
      <br />
      <input
        type="text"
        on:click|preventDefault={handleMount}
        bind:value={mountKey}
        {disabled} />
    </form>
  </div>

</main>
