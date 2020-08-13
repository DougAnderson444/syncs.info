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

  //import { exchangeMessages } from '../../js/connectServiceWorker.js'
  //import { createUser } from '../../js/bridgeFunctions.js'

  //svelte stores
  import {
    lockerSection,
    deviceType,
    deviceName,
    ipfsNode,
  } from '../../js/stores.js'
  import { onMount } from 'svelte'

  import { DEVICE_TYPES } from '../../js/constants'

  $deviceName = 'My Samsung'
  $deviceType = DEVICE_TYPES[0]
  let selectedDeviceType = $deviceType
  let disabled = true
  $: $ipfsNode ? (disabled = false) : (disabled = true)

  const handleButtonClick = async () => {
    $lockerSection = 'CreateUserProgress'
  }
</script>

<style>
  * :global(.list) {
    max-width: 600px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
  .narrow {
    width: 250px;
  }
  .vert {
    margin: 1em 0 1em 0;
    padding: 1em 0 1em 0;
  }
</style>

<h3>Select what type of device this is (it's smart to add a few devices)</h3>

<div class="narrow vert">
  <List class="list" radiolist>
    {#each DEVICE_TYPES as device}
      <Item>
        <Graphic>
          <Radio bind:group={selectedDeviceType} value={device} />
        </Graphic>
        <Graphic class="material-icons">
          {device != 'desktop' ? device : 'computer'}
        </Graphic>
        <Label>{device}</Label>
      </Item>
    {/each}
  </List>
</div>

<h3>Name this device (it's smart to add a few devices)</h3>
<div class="vert">
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

<Button variant="raised" on:click={handleButtonClick} {disabled}>
  <Label>Next</Label>
</Button>
{#if disabled}
  <br />
  Just a moment while your browser finishes creating your Web3 space
{/if}
