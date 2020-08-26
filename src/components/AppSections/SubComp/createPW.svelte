<script>
  import { passwordToPem } from '../../../js/process.js'

  // svelte stuff
  import {
    username,
    password,
    algorithm,
    mnemonic,
    seed,
    masterKeyPair,
  } from '../../../js/stores.js'
  let status
  $mnemonic = 'Start mnemonic'
  ;(async () => {
    let start = Date.now()
    console.log(
      `Password creation begins`,
      new Date(start).toLocaleTimeString(),
    )
    status = `Password creation begins ` + new Date(start).toLocaleTimeString()

    const { algorithm, mnemonic: mne, masterKeyPair, seed } = await passwordToPem(
      $username,
      $password,
    )
    console.log(`Password created: `, Date.now() - start)
    console.log(`mnemonic: `, mne)
    $mnemonic = mne
    /*
    status = `Password created: ` + (Date.now() - start)
    $algorithm = algorithm
    
    $seed = seed
    $masterKeyPair = masterKeyPair
    */
  })()
</script>

<div>
  {status}
  <br />
  {#if $mnemonic}
    {#await $mnemonic}
      <p>...waiting</p>
    {:then $mnemonic}
      <p>The $mnemonic is {$mnemonic}</p>
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  {/if}

</div>
