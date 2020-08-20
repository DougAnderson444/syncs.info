<script>
  import ProgressStatus from '../AppSections/Display/ProgressStatus.svelte'
  import * as pro from '../../js/process'
  import { DID_DOC_TLD, ROOT_CID_PEM } from '../../js/constants.js'
  import ObjectComp from '../Utility/ObjectComp.svelte'

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
    identity,
    did,
  } from '../../js/stores.js'
  const LOCK_TYPE = 'passphrase'
  let pageSaved = false
  let response, masterKeyPair, didDoc
  ;(async () => {
    response = await pro.passwordToPem($username, $password, 1)
    $rootCidPem = response.masterKeyPair.privateKey
    $dataPeerId = await pro.pemToPeerId($rootCidPem)
  })()

  const addService = async () => {
    console.log(`Step 6: Create data /ipns/ service`)

    $wallet.locker.store(ROOT_CID_PEM, $rootCidPem)

    let backup = await $identity.backup.getData()
    $serviceEndpoint = `/ipns/${$dataPeerId.toB58String()}`
    didDoc = await $wallet.identities.addService(
      'ipid',
      { privateKey: backup.privateKey },
      {
        id: `data`,
        type: 'DataHub',
        serviceEndpoint: $serviceEndpoint,
      },
    )
  }
  // .identities.isLoaded()?
  $: if ($identity && $wallet.identities.isLoaded() && $did && $dataPeerId)
    addService()
</script>
<ProgressStatus bind:awaiting={didDoc}>
  <span slot="before">Creating your data id...</span>
  <div slot="complete">
    Data ID created. /ipns/{$dataPeerId}
    <br />
    DIDDoc updated
    <br />
    <ObjectComp val={didDoc} key="DID Document (Click to expand)" />
  </div>
</ProgressStatus>
