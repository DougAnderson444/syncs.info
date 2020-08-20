<script>
  import { lockerSections } from '../components/LockerSections'
  import * as pro from '../js/process'
  import Timer from '../components/LockerSections/Timer'

  //svelte stores
  import { lockerSection, dnsLink, ipfsNode, wallet } from '../js/stores.js'
  import { onMount } from 'svelte'

  let active
  // If I go to the Locker page, it means I have a dnslink for this subdomain
  $: {
    if (!$wallet && $ipfsNode)
      pro
        .createNewWallet(
          $ipfsNode,
          process.env.SAPPER_APP_API_URL,
          process.env.SAPPER_APP_WS_URL,
        )
        .then((w) => {
          $wallet = w
        })
  }
  $: {
    if (
      $wallet &&
      $lockerSection != 'CreateNewUser' &&
      $lockerSection != 'SetupDevice' &&
      $lockerSection != 'CreateUserProgress'
    ) {
      if ($wallet.locker.isPristine()) {
        console.log(`wallet isPristine`)
        if (!$dnsLink) $lockerSection = 'CreateNewUser'
        else $lockerSection = 'LockScreen'
      }
    }
  }

  const handleLockedChanged = () => {
    $wallet = $wallet // triggers reactivity that depends on a refreshed $wallet, like Timer
  }

  // Anything with $: in front means it's reactive (built in to svelte)
  $: if ($wallet && $wallet.locker.isLocked()) $lockerSection = 'LockScreen'
  $: $wallet ? $wallet.locker.onLockedChange(handleLockedChanged) : null // lock and unlock signal
  $: active = lockerSections[$lockerSection]

  onMount(async () => {})
</script>

<svelte:head>
  <title>Your Data Syncs</title>
</svelte:head>

<div class="content">
  {#if active && $lockerSection}
    <svelte:component this={active.component} />
  {/if}

</div>
<svelte:component this={Timer} />
