<script>
  import * as pro from "../../js/process";
  import ProgressStatus from "../AppSections/Display/ProgressStatus.svelte";

  //svelte stores
  import {
    deviceType,
    deviceName,
    name,
    username,
    password,
    wallet,
    identity,
    did,
    makeDrives
  } from "../../js/stores.js";

  const LOCK_TYPE = "passphrase";
  let enabled = false;

  const createNewIdentity = async () => {
    console.log(`Step 2. Create Identity (DID)`);

    const drive = $makeDrives($name);

    $identity = await pro.createNewIdentity(
      $wallet,
      $username,
      $password,
      $deviceName,
      $deviceType,
      drive,
      $name
    );
    $did = await $identity.getDid();
    //backup = await identity.backup.getData()
  };

  $: enabled = $wallet.locker.getLock(LOCK_TYPE).isEnabled();
  $: if (enabled && !$identity) createNewIdentity();
</script>

<ProgressStatus bind:awaiting={$did}>
  <span slot="before">Creating your Digital Identity...</span>
  <span slot="complete">Digital Identity created. {$did}</span>
</ProgressStatus>
