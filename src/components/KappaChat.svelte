<script>
  import { onMount } from "svelte";
  import { FIRST, LAST } from "../js/constants";

  var memdb = require("level-mem");
  var list = require("kappa-view-list");
  var pump = require("pump");
  var crypto = require("crypto");
  
  onMount(() => {
    console.log(window);
    main();
  });

  let nickname =
    FIRST[Math.floor(Math.random() * 10)] +
    "-" +
    LAST[Math.floor(Math.random() * 10)];

  let output = "";
  let textIn;
  var feed;

  var timestampView = list(memdb(), function(msg, next) {
    if (msg.value.timestamp && typeof msg.value.timestamp === "string") {
      // sort on the 'timestamp' field
      next(null, [msg.value.timestamp]);
    } else {
      next();
    }
  });

  async function main() {
    const kappa = window.sdkappa({
      persist: true,
      applicationName: "kappaChatty"
    });
    var core = kappa.core;
    var hyperswarm = kappa.hyperswarm;

    core.ready(() => {
      console.log(`kappa core ready`);
    });

    core.use("chats", timestampView);

    core.ready("chats", () => {
      // wait until core writer is ready before connecting to swarm
      core.writer("local", function(err, f) {
        if (err) console.error(err);
        feed = f;
        // swarm logic
        const topicHex = crypto
          .createHash("sha256")
          .update("our-topic")
          .digest();
        startSwarm(topicHex);
        watchTail(); // listen for updates to the lastest messages
        readTail(10); // initial read, since tail only triggers on new append()
      });
    });

    function readTail(number) {
      // Print the last saved entries
      core.api.chats.read({ limit: number, reverse: true }, function(
        err,
        msgs
      ) {
        if (err) console.error(err);
        if (msgs.length > 0) {
          for (var i = msgs.length - 1; i >= 0; i--) {
            output += `<br/>${msgs[i].value.timestamp} - ${msgs[i].value.nickname}: ${msgs[i].value.text}`;
          }
        }
      });
    }
    function watchTail() {
      core.api.chats.tail(10, function(msgs) {
        // output = ""; //only show the lastest messages
        output += `<br/>----------TAIL-----------------`;
        msgs.forEach(function(msg, i) {
          output += `<br/>${msg.value.timestamp} - ${msg.value.nickname}: ${msg.value.text}`;
        });
      });
    }

    function startSwarm(topic) {
      var swarm = hyperswarm();
      output += `<br/>topic: ${topic.toString("hex")}`;

      swarm.join(topic, {
        lookup: true, // find & connect to peers
        announce: true // optional- announce self as a connection target
      });
      swarm.on("connection", function(connection, info) {
        output += `<br/>New peer connected!`;

        const stream = core.replicate(info.client, { live: true });
        stream.on("remote-feeds", function() {
          // output += `<br/>remote-feeds fired. Refreshing tail.`;
          // too soon, view not ready yet?
          // how do I tell when the view has loade all these new feeds?
          // using a new view does nothing except duplicate
        });

        pump(connection, stream, connection);
      });
    }
  }

  function doWrite(feed, data) {
    feed.append({
      type: "chat-message",
      nickname,
      text: data.toString().trim(),
      timestamp: new Date().toISOString()
    });
  }

  const handleSubmit = () => {
    doWrite(feed, textIn);
    textIn = "";
  };
</script>

<style>
  div.output {
    border: 1px solid salmon;
    padding: 1em;
    margin: 1em;
  }
  .form {
    border: 1px solid green;
    padding: 1em;
    margin: 1em;
  }
</style>

<div class="output">
  Hyper-kappa-chat-app:
  <br />
  {@html output}
</div>
<div>
  <form class="form" on:submit|preventDefault={handleSubmit}>
    Chat:
    <br />
    <input type="text" bind:value={textIn} />
  </form>
</div>
