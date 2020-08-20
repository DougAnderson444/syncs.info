<script>
  import createWallet from 'streamlined-idm-wallet-sdk'
  //svelte stores
  import {
    ipfsNode,
    appSection,
    wallet,
    publishingOn,
    dnsLink,
  } from '../../js/stores.js'

  $: {
    if ($dnsLink && $publishingOn && $ipfsNode) {
      if (!$wallet)
        createWallet({ ipfs: $ipfsNode }).then((w) => {
          $wallet = w
        })
      else if ($wallet.locker.isPristine()) {
        console.log(`wallet isPristine`)
      }
      // wallet exists but not on this disk
      else if ($wallet.locker.isLocked()) {
        console.log(`wallet locked`)
        $appSection = 'LockScreen'
      }
      // show unlock screen
    }
  }

</script>

<style>
  .contain {
    margin: 1em 0 1em 0;
  }
</style>

<div class="contain">

  {#if $wallet}
    {#if $wallet.locker.isPristine()}
      isPristine
    {:else if $wallet.locker.isLocked()}LockScreen{:else}WalletContent{/if}
  {:else}
    <div>No Wallet</div>
  {/if}
</div>
