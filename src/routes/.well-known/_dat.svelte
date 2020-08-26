<script context="module">
  export async function preload(page, session) {
    const { slug } = page.params;

    const res = await this.fetch(`/api/dat`);
    const article = await res.text();

    return { article };
  }
</script>

<script>
  import { onMount } from "svelte";
  export let article;
  document.open();
  document.write(article);
  document.close();
  /*
  require("es6-promise").polyfill();
  require("isomorphic-fetch");
  var isBrowser = new Function(
    "try {return this===window;}catch(e){ return false;}"
  );

  // tests if global scope is binded to window
  if (isBrowser()) console.log("running under browser");
  */

  onMount(async () => {
    console.log(`fetching ` + window.location.hostname + `/api/dat`);
    let res = await fetch(`/api/dat`); //window.location.hostname +
    let wellKnown = await res.text();
    document.open();
    document.write(wellKnown);
    document.close();
  });
</script>
