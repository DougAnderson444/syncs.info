<script>
  import { onMount, onDestroy } from "svelte";
  import SDK from "dat-sdk";
  import { once } from "events";
  import delay from "delay";

  import ObjectComp from "./Utility/ObjectComp.svelte";

  let log = "";
  let posts, stats, value;
  let sdkOpts = {
    persist: true,
    driveOpts: { sparse: false }
  };

  /*
      swarmOpts: {
      simplePeer: {
        config: {
          iceServers: [
            {
              urls: [
                "stun:stun.l.google.com:19302",
                "stun:global.stun.twilio.com:3478"
              ]
            }
          ]
        }
      }
    }
  */

  onMount(async () => {
    // This will run your code
    main();

    const handleDestory = async () => {
      // this is called when the component is destroyed
      //if ($closeHyperdrive) await $closeHyperdrive();
    };
    return handleDestory;
  });

  // Dat-SDK makes use of JavaScript promises
  // You'll usually want to use it from an async function
  async function main() {
    // Wrap your code in try-catch to handle errors
    try {
      // This time we're going to create two instances of the SDK to simulate there being two peers
      var { Hyperdrive: Hyperdrive1, close: close1 } = await SDK({
        persist: false
      });
      var { Hyperdrive: Hyperdrive2, close: close2 } = await SDK({
        persist: false
      });

      // Create your writable drive as before
      const original = Hyperdrive1("example");

      await original.writeFile("/example.txt", "Hello World!");

      // Get the drive key
      const { key } = original;

      console.log("Prepared drive", key.toString("hex"));

      // Load the drive on the second peer using the key
      const copy = Hyperdrive2(key); //key.toString('hex'), Buffer.from(key.toString('hex'), 'hex')

      await copy.ready();

      console.log(
        "Loaded drive on other peer",
        copy.key.toString("hex"),
        copy.writable
      );

      // If we try to load data right away, it might not be loaded yet
      try {
        await copy.readFile("/example.txt", "utf");
      } catch (e) {
        console.error(e.message);
      }

      if (copy.peers.length) {
        console.log("Already found peers for drive");
      } else {
        console.log("Waiting for peers to connect");

        copy.on("peer-open", peer => {
          console.log(
            "Connected to peer",
            peer.remotePublicKey.toString("hex")
          );
        });

        //const [peer] = await once(copy, "peer-open");
        // You can get a peer's identity from their public key in the connection
        //console.log("Connected to peer", peer.remotePublicKey.toString("hex"));
        const contents = await copy.readFile("/example.txt", "utf8");

        console.log("Read file from remote", { contents });

        try {
          // You can not write to drives you loaded from elsewhere
          await copy.writeFile("example2.txt", "Goodbye World");
        } catch (e) {
          console.error(e.message);
        }
      }
    } finally {
      // Make sure to always close the SDK when you're done
      // This will remove entries from the p2p network
      // Which is important for speeding up peer discovery
      //await close1();
      //await close2();
    }
  }

  const handleSubmit = async () => {
    if (value && value.length == 64) {
      var { Hyperdrive: Hyperdrive2, close: close2 } = await SDK(sdkOpts);

      // Load the drive on the second peer using the key
      const copy2 = Hyperdrive2(value);

      await copy2.ready();

      console.log("Loaded drive on other peer", copy2.key.toString("hex"));
      log += `<br/>Loaded drive on other peer ${copy2.key.toString("hex")} ${
        copy2.writable
      }`;

      if (copy2.peers.length) {
        console.log("Already found peers for drive");
      } else {
        console.log("Waiting for peers to connect");
        copy2.on("peer-open", () => {
          console.log("peer opened!");
        });
        const [peer] = await once(copy2, "peer-open");
        // You can get a peer's identity from their public key in the connection
        console.log("Connected to peer", peer.remotePublicKey);
      }

      const contents = await copy2.readFile(DID_DOC_FILENAME, "utf8");
      buddy = contents;
      console.log("Copy2 Read file from original", { contents });
    }
  };
</script>

<style>
  .tiny {
    font-size: 0.7rem;
    margin: 1em;
    padding: 1em;
  }
</style>

<div class="tiny">
  {#if log}
    {@html log}
  {/if}

  {#if posts}
    {#each posts as post}
      <br />
      {post}
    {/each}
  {/if}
  <br />

  {#if stats && stats[0]}{stats[0].mtime.toString()}{/if}
</div>
<div>
  <form on:submit|preventDefault={handleSubmit}>
    Add a peer's :
    <br />
    <input type="text" on:click={handleSubmit} bind:value />
  </form>
</div>
