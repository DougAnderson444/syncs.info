<script>
  import * as pro from '../../js/process'
  import ProgressStatus from '../AppSections/Display/ProgressStatus.svelte'

  //svelte stores
  import {
    deviceType,
    deviceName,
    username,
    password,
    wallet,
    identity,
    did,
  } from '../../js/stores.js'

  const LOCK_TYPE = 'passphrase'
  let enabled = false

  const createNewIdentity = async () => {
    console.log(`Step 2. Create Identity (DID)`) //edit version
    //identity = await
    $identity = await pro.createNewIdentity(
      $wallet,
      $username,
      $password,
      $deviceName,
      $deviceType,
    )
    $did = await $identity.getDid()
    //backup = await identity.backup.getData()
  }

  $: enabled = $wallet.locker.getLock(LOCK_TYPE).isEnabled()
  $: if (enabled && !$identity) createNewIdentity()
</script>

<ProgressStatus bind:awaiting={$did}>
  <span slot="before">Creating your Digital Identity...</span>
  <span slot="complete">Digital Identity created. {$did}</span>
</ProgressStatus>
