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

  let pageSaved = false

  const savePage = async () => {
        console.log(`Step 5: Save username to Fauna`)
        pageSaved = await pro.savePage({
          username: $username,
          ipns: $did.replace('did:ipid:', '/ipns/'),
        })
  }

  $: if ($username && $did) savePage()
</script>
<ProgressStatus bind:awaiting={pageSaved}>
  <span slot="before">Saving your page...</span>
  <span slot="complete">Page saved.</span>
</ProgressStatus>