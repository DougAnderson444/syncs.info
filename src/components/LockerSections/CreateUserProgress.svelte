<script>
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
  } from '../../js/stores.js'
  import { onMount } from 'svelte'

  let did, pageSaved, serviceAdded, identity, isLoaded
  const LOCK_TYPE = 'passphrase'

  onMount(async () => {
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

        /*
        console.log('Serialized:', {
          addedAt: identity.getAddedAt(),
          id: identity.getId(),
          did,
          devices: identity.devices.list(),
          backup,
          profile: identity.profile.getDetails(),
        }) */

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

        console.log(`local resolve:`, did.match(/did:(\w+):(\w+).*/)[2])
        let r = await last(
          $ipfsNode.name.resolve(did.match(/did:(\w+):(\w+).*/)[2]),
        )
        console.log(r)

        serviceAdded = await $wallet.identities.addService(
          'ipid',
          { privateKey: backup.privateKey },
          {
            id: `data`,
            type: 'DataHub',
            serviceEndpoint: `/ipns/${$dataPeerId.toB58String()}`,
          },
        )
        $lockerSection = 'LockerContents'
      })
  })
</script>

<style>

</style>

Creating details:
<br />

<ProgressStatus bind:awaiting={$wallet}>
  <span slot="before">Creating your data wallet in the browser...</span>
  <span slot="complete">Wallet created.</span>
</ProgressStatus>

<ProgressStatus bind:awaiting={did}>
  <span slot="before">Creating your Digital Identity...</span>
  <span slot="complete">Digital Identity created.</span>
</ProgressStatus>

<ProgressStatus bind:awaiting={$dnsLink}>
  <span slot="before">Creating your DNS Link...</span>
  <span slot="complete">DNS Link created.</span>
</ProgressStatus>

<ProgressStatus bind:awaiting={pageSaved}>
  <span slot="before">Saving your page...</span>
  <span slot="complete">Page saved.</span>
</ProgressStatus>

<ProgressStatus bind:awaiting={$dataPeerId}>
  <span slot="before">Creating your data id...</span>
  <span slot="complete">Data ID created. /ipns/{$dataPeerId}</span>
</ProgressStatus>

<ProgressStatus bind:awaiting={serviceAdded}>
  <span slot="before">Linking Data ID to digital identity...</span>
  <span slot="complete">Linked.</span>
</ProgressStatus>
