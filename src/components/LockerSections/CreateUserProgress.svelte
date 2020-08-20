<script>
  import { lockerSections } from './index.js'
  import { Icon } from '@smui/common'
  import Spinner from '../AppSections/Display/Spinner.svelte'
  import * as pro from '../../js/process'
  import { DID_DOC_TLD, ROOT_CID_PEM } from '../../js/constants.js'
  import ProgressStatus from '../AppSections/Display/ProgressStatus.svelte'
  const last = require('it-last')

  //svelte stores
  import {
    lockerSection,
    deviceType,
    deviceName,
    username,
    password,
    ipfsNode,
    wallet,
    rootCidPem,
    dataPeerId,
    dnsLink,
    serviceEndpoint,
    backgroundComponents,
  } from '../../js/stores.js'
  import { onMount } from 'svelte'

  $backgroundComponents = [
    ...$backgroundComponents,
    lockerSections['CreateIdentity'],
    lockerSections['CreateDNSLink'],
    lockerSections['CreateDatabaseEntry'],
    lockerSections['CreateDataServiceEntry'],
  ]

  let did, pageSaved, serviceAdded, identity, isLoaded
  const LOCK_TYPE = 'passphrase'

  onMount(async () => {
    /*
    // send the data to the service worker to create the account in the background
    console.log(`Step 1. Enable  wallet`)
    $wallet.locker
      .getLock(LOCK_TYPE)
      .enable($password)
      .catch((err) => {
        console.log(err)
      })

    console.log(`Step 2. Create Identity (DID)`) //edit version
    //identity = await
    pro
      .createNewIdentity(
        $wallet,
        $username,
        $password,
        $deviceName,
        $deviceType,
      )
      .then(async (identity) => {
        did = await identity.getDid()
        let backup = identity.backup.getData()

        console.log(`Step 4: Create dnslink=/ipns/DIDDoc`)
        $dnsLink = await pro.recordDNSLink(
          $username,
          did.replace('did:ipid:', '/ipns/'),
          DID_DOC_TLD,
        )

        console.log(`Step 5: Save username to Fauna`)
        pageSaved = await pro.savePage({
          username: $username,
          ipns: did.replace('did:ipid:', '/ipns/'),
        })

        console.log(`Step 6: Create data /ipns/ service`)
        const { masterKeyPair } = await pro.passwordToPem(
          $username,
          $password,
          1,
        )
        $rootCidPem = masterKeyPair.privateKey
        $dataPeerId = await pro.pemToPeerId($rootCidPem)

        $wallet.locker.store(ROOT_CID_PEM, $rootCidPem)

        await backup
        serviceAdded = await $wallet.identities.addService(
          'ipid',
          { privateKey: backup.privateKey },
          {
            id: `data`,
            type: 'DataHub',
            serviceEndpoint: `/ipns/${$dataPeerId.toB58String()}`,
          },
        )
        $serviceEndpoint = `/ipns/${$dataPeerId.toB58String()}`
        //$lockerSection = 'LockerContents'
      })
      */
  })
</script>

<style>
</style>

Creating details:
<br />
{#if $backgroundComponents && $backgroundComponents.length > 0}
  {#each $backgroundComponents as background}
    <svelte:component this={background.component} />
  {/each}
{/if}
