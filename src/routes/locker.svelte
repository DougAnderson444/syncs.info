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
          console.log(`wallet created`)
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
        $lockerSection = 'CreateNewUser'
      }
    }
  }
  
  const handleLockedChanged = () => {
    console.log(`Lock changed ${new Date(Date.now())}`)
    //$lockerSection = 'LockScreen'
    $wallet = $wallet
  }
  
  $: if($wallet && $wallet.locker.isLocked()) $lockerSection = 'LockScreen'

  //$: $wallet ? $wallet.locker.onLockedChange(handleLockedChanged) : null
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
<Timer />
