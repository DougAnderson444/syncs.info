<script>
  import { onMount } from 'svelte'
  export let ipfs, cid, res
  export let textContent = []

  onMount(async () => {
    res = await ipfs.id() //works
  })

  const handleClick = async () => {
    let path = '/tmp/myfile.txt'
    let content = 'ABC'

    const files = [
      {
        path: path,
        content: content,
      },
    ]

    try {
      await ipfs.files.write(path, content, {
        create: true,
        parents: true,
      })
      // write to disk
      cid = await ipfs.files.flush('/')
      console.log(cid)
    } catch (err) {
      console.log(err)
    }
  }

  navigator.serviceWorker.addEventListener('message', function (event) {
    console.log(event)
    var clientId = event.data.client
    let newMsg = 'Client ' + clientId + ' says: ' + event.data.message
    textContent = [...textContent, newMsg]
  })
</script>

<br />
{#if res}
  {#await res then res}
    Res: {res.id}
    <br />
    <button on:click={handleClick}>Save Data</button>
  {/await}
{/if}

{#if cid}
  {#await cid then cid}
    <a href="https://explore.ipld.io/#/explore/{cid}" target="_blank">Cid:</a>
    {cid}
    <br />
  {/await}
{/if}

{#if textContent}
  <ul>
    {#each textContent as text}
      <li>{text}</li>
    {/each}
  </ul>
{/if}
