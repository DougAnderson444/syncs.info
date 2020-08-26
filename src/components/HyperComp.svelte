<script>
  import { onMount } from "svelte";
  import SDK from "dat-sdk";
  import ObjectComp from "./Utility/ObjectComp.svelte";

  let log = "";
  let wellKnown = "";
  let posts, stats;

  onMount(async () => {
    // This will run your code
    main().catch(e => {
      // If there's an error blow up the process
      process.nextTick(() => {
        throw e;
      });
    });
  });

  // Dat-SDK makes use of JavaScript promises
  // You'll usually want to use it from an async function
  async function main() {
    try {
      var { Hyperdrive, resolveName, close } = await SDK({
        persist: true,
        driveOpts: { sparse: false }
      });
      // Creating a Hyperdrive involves specifying a name for it
      // The `name` will yield a unique Hyperdrive key on your computer
      // Every time you use the same `name` on your computer will get the same drive
      // The `name` can be anything that's not a hyper:// URL or look like a domain name
      const drive = Hyperdrive("example");

      // Before using functions of the drive,
      // It's good to wait for it to fully load
      // However, most async functions can be used right away
      await drive.ready();

      // Here's how you can generate a hyper URL for a drive
      const url = `hyper://${drive.key.toString("hex")}`;
      log += `<br/>Drive ready, ${url}`;

      const initFile = "/inititalized.txt";
      // An error gets thrown if you try to read something that doesn't exist
      try {
        await drive.readFile(initFile);
        log += `<br/>EXISTING drive`;
      } catch (e) {
        console.error(e.message);
        log += `<br/>NEW drive: ` + e.message;
        // You can use a file path and some data to write a file
        await drive.writeFile(
          initFile,
          "Created " + new Date(Date.now()).toLocaleTimeString()
        );
      }

      // You can use readFile to get the content back
      // By default it will read content as raw buffers
      log += `<br/>Wrote to drive` + (await drive.readFile(initFile));

      // You can read it as text too
      log += `<br/>Read from drive ` + (await drive.readFile(initFile, "utf8"));

      try {
        posts = await drive.readdir("/posts");
      } catch (error) {
        // You can create folders to group files together
        await drive.mkdir("/posts");
        console.log("Created `posts` folder");
        log += `<br/>Created 'posts' folder `;
        // You can write files to a folder using the right path
        await drive.writeFile("/posts/one.md", "# Hello");
        await drive.writeFile("/posts/two.md", "# World");
        posts = await drive.readdir("/posts");
      }

      console.log("Inside the posts folder", { posts });
      log += `<br/>Inside the posts folder: ` + { posts };

      // You can get info about a path using `stat`
      stats = await drive.stat(initFile);
      console.log("Stats about example text", stats[0]);
      log += `<br/>Stats about example text: ` + stats[0];

      // You can stop seeding the Hyperdrive by closing it
      await drive.close();

      console.log("Closed");

      log += `<br/>Closed.`;
    } finally {
      // Make sure to always close the SDK when you're done
      // This will remove entries from the p2p network
      // Which is important for speeding up peer discovery
      await close();
    }
  }
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
