<script>
  (async () => {
    let res = await fetch(`/api/dat`);
    let wellKnown = await res.text();
    document.open()
    document.write(wellKnown);
    document.close()
  })();
</script>