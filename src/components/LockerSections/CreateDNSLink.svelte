<script>
  import ProgressStatus from '../AppSections/Display/ProgressStatus.svelte'
  import * as pro from '../../js/process'
  import { DID_DOC_TLD, ROOT_CID_PEM } from '../../js/constants.js'

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
    did
  } from '../../js/stores.js'
  const LOCK_TYPE = 'passphrase'
  let enabled = false

  const recordDNSLink = async () => {
        console.log(`Step 3: Create dnslink=/ipns/DIDDoc`)
        $dnsLink = await pro.recordDNSLink(
          $username,
          $did.replace('did:ipid:', '/ipns/'),
          DID_DOC_TLD,
        )
  }

  $: if ($username && $did && !$dnsLink) recordDNSLink()
</script>
<ProgressStatus bind:awaiting={$dnsLink}>
  <span slot="before">Creating your DNS Link...</span>
  <span slot="complete">DNS Link created.</span>
</ProgressStatus>