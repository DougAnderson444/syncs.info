<script>
  import CreateButton from './CreateButton.svelte'
  import { stores } from '@sapper/app'

  const { page } = stores()
  // export let domain = $page.host

  let regex = /(\w+\.\w+)$/ // (?!^:$)
  let tld //= domain.match(regex)
  tld = process.env.SAPPER_APP_TLD //domain.includes('localhost') ? 'localhost' :

  let subdomainOk = /^(?!.{64})(?:[a-z0-9](?:[a-z0-9-_]{0,61}[a-z0-9])?)+/

  let pageToSearch, searchState, errorMessage, pageExists

  const checkIfPageExists = async (e) => {
    if (pageToSearch && pageToSearch.match(subdomainOk) == pageToSearch) {
      searchState = 'SEARCHING'
      try {
        let res = await fetch(`/api/get-page?page=${encodeURI(pageToSearch)}`)
        if (res.status === 200) {
          searchState = 'ERROR'
          pageExists = { name: `${pageToSearch}.${tld}` }
          return
        }
        if (res.status === 404) {
          window.location.href = `http://${pageToSearch}.${tld}`
        } else {
          let { message, stack } = await res.json()
          throw new Error(message)
        }
      } catch (e) {
        console.log(e.message)
        errorMessage = e.message
        searchState = 'NETWORK_ERROR'
        return
      }
    } else {
      // not ok
      errorMessage = 'Invalid name. Try again!'
      console.log(errorMessage)
    }
  }

  const pageSearchInputHandler = (e) => {
    if (searchState) {
      searchState = ''
      pageExists = null
    }
    errorMessage = ''
  }
</script>

<style>
  input {
    border-color: #ccc;
    width: 120px;
    max-width: 40vw;
    padding: 0.35em;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
  input.ERROR {
    border-color: #f3424d;
  }
  form {
    flex: 0;
    display: inline-block;
    align-items: center;
    text-align: center;
    margin-top: 1px;
    margin-bottom: 1px;
    white-space: nowrap;
    min-height: 10px;
  }
  form .suffix {
    font-weight: bold;
    font-size: 16px;
    margin-left: 1px;
    margin-right: 1px;
  }
  .page-exists,
  .error-message {
    color: red;
    padding: 0.25em;
    font-family: Menlo, monospace;
    text-transform: uppercase;
    text-align: center;
    font-size: 0.8em;
  }
  .page-exists a {
    color: red;
  }
</style>

<span>Get your page:</span>
<form class="form" on:submit|preventDefault={checkIfPageExists}>
  <span>
    <input
    id="create-domain"
      class={searchState}
      required
      color="#9b51e0"
      bind:value={pageToSearch}
      on:change={pageSearchInputHandler}
      on:keydown={pageSearchInputHandler}
      placeholder="myname" />
    <span class="suffix">.{tld}</span>
    <CreateButton on:click={checkIfPageExists} {searchState} />
  </span>
</form>
{#if errorMessage}
  <br />
  <div class="error-message" >
    <span id="error-message">{errorMessage}</span>
  </div>
{/if}
{#if pageExists}
  <br />
  <span class="page-exists">
    🚨
    <a href={`https://${pageExists.name}`}>{pageExists.name}</a>
    taken! Try another one.
  </span>
{/if}
