<script>
  export let ipfs
  export let cid
  export let key
  let v
  ;(async () => {
    let res = await ipfs.dag.get(cid)
    console.log('res.value ', res.value)
    console.log('key ', key)
    console.log('value[key] ', res.value[key])
    v = res.value[key]
  })()
</script>

{#if v}{v.value}{/if}
