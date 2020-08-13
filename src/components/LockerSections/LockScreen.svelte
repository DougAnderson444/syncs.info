<script>
  //svelte stores
  import { wallet, lockerSection } from '../../js/stores.js'

  // Svelte Material UI
  import Textfield from '@smui/textfield'
  import HelperText from '@smui/textfield/helper-text'
  import { Label, Icon } from '@smui/common'

  import Warning from '../errors/Warning.svelte'
  import Spinner from '../AppSections/Display/Spinner.svelte'

  const LOCK_TYPE = 'passphrase'

  let loading = false
  let error = undefined
  let value = ''

  const unlock = (lockType, challenge) => {
    loading = true

    $wallet.locker
      .getLock(lockType)
      .unlock(challenge)
      .then(() => {
        console.log(`Unlocked`)
        $lockerSection = 'LockerContents'
      })
      .catch((err) => {
        loading = false
        console.log(`unlock err: ${err}`)
        error = err
      })
  }

  const handleInputKeyPress = (event) => {
    if (event.charCode === 13) {
      unlock(LOCK_TYPE, value)
    }
  }
</script>

<style>
  .contain {
    margin: 1em 0 1em 0;
    width: 550px;
  }
</style>

<div class="contain">
  <div>
    <h1>Unlock your account</h1>
    <Textfield
      bind:value
      type="password"
      variant="outlined"
      label="Passphrase"
      input$aria-controls="super-helper"
      input$aria-describedby="super-helper"
      on:keypress={handleInputKeyPress} />
    <HelperText id="super-helper">Enter your passphrase to unlock</HelperText>

    <Warning show={error}>
      <span slot="phrase">⛔️ {error.message} ⛔️</span>
    </Warning>

  </div>
  {#if loading}
    <Spinner />
  {/if}
</div>
