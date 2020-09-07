<script>
  import SimplePeer from "simple-peer";
  import { onMount } from "svelte";

  let textContent = "Outgoing";
  let value, p;

  onMount(async () => {
    p = new SimplePeer({
      initiator: location.hash === "#1",
      trickle: false
    });

    console.log(`isinitiator? `,p.initiator)

    p.on("error", err => {
      textContent += "<br/>" + err;
      console.error("error", err);
    });

    p.on("signal", data => {
      console.log("SIGNAL", JSON.stringify(data));
      textContent += "<br/>" + JSON.stringify(data);
    });

    p.on("connect", () => {
      console.log("CONNECT");
      textContent += "<br/>" + "CONNECT";
      p.send("whatever " + Math.random());
    });

    p.on("data", data => {
      textContent += "<br/>" + data;
      console.log("data: " + data);
    });
  });

  const handleSubmit = ev => {
    p.signal(JSON.parse(value));
  };
</script>

<style>
  #outgoing {
    width: 600px;
    word-wrap: break-word;
    white-space: normal;
  }
</style>

<div>
  <form class="form" on:submit|preventDefault={handleSubmit}>
    <textarea id="incoming" bind:value />
    <button type="submit">submit</button>
  </form>
  <pre id="outgoing">
    {@html textContent}
  </pre>
</div>
