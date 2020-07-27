<script>
  import FormField from '@smui/form-field'
  import Button, { Label } from '@smui/button'
  import Textfield, { Input, Textarea } from '@smui/textfield'
  import HelperText from '@smui/textfield/helper-text/index'
  import Radio from '@smui/radio'
  import List, {
    Group,
    Item,
    Graphic,
    Meta,
    Separator,
    Subheader,
    Text,
    PrimaryText,
    SecondaryText,
  } from '@smui/list'

  import { exchangeMessages } from '../../js/connectServiceWorker.js'
  import { createUser } from '../../js/bridgeFunctions.js'

  //svelte stores
  import {
    appSection,
    deviceType,
    deviceName,
    username,
    password,
  } from '../../js/stores.js'

  import { DEVICE_TYPES } from 'streamlined-idm-wallet-sdk/src/identities/identity/utils/constants/devices'

  $deviceName = 'My Samsung'
  $deviceType = DEVICE_TYPES[0]
  let selectedDeviceType = $deviceType

  export let loading
  let error, ok

  const handleButtonClick = async() => {
    console.log('Clicked')
    // send the data to the service worker to create the account in the background
    await createUser($username, $password, $deviceName, $deviceType)
    //$appSection = 'ProcessCreateUser'
  }
</script>

<style>
  * :global(.list) {
    max-width: 600px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
  }
  .narrow {
    width: 250px;
  }
</style>

{#if loading}
  <div>...Loading...</div>
{:else}

  <h3>Select what type of device this is (it's smart to add a few devices)</h3>

  <div class="narrow">
    <List class="list" radiolist>
      {#each DEVICE_TYPES as device}
        <Item>
          <Graphic>
            <Radio bind:group={selectedDeviceType} value={device} />
          </Graphic>
          <Label>{device}</Label>
        </Item>
      {/each}
    </List>
    <div>
      <pre class="status">Selected: {selectedDeviceType}</pre>
    </div>
  </div>

  <h3>Name this device (it's smart to add a few devices)</h3>
  <div>
    <Textfield
      bind:value={$deviceName}
      on:focus|once={() => {
        $deviceName = ''
      }}
      variant="outlined"
      label="Device Nickname"
      input$aria-controls="helper-text-outlined-device"
      input$aria-describedby="helper-text-outlined-device"
      autocomplete="nickname" />
    <HelperText id="helper-text-outlined-device">Device Nickname</HelperText>
  </div>

  <Button variant="raised" on:click={handleButtonClick}>
    <Label>Next</Label>
  </Button>
{/if}
