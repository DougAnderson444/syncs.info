<script>
  // svelte stuff
  import { onMount, onDestroy } from 'svelte'

  //svelte stores
  import { wallet } from '../../js/stores.js'

  let timeDisplay
  let time = 0
  let idleTimeout
  let mounted

  onMount(async () => {
    mounted = true
  })

  onDestroy(() => {
    clearTimeout(idleTimeout)
  })

  const getRemainingTime = () => {
    if ($wallet && !$wallet.locker.isLocked())
      idleTimeout = setTimeout(getRemainingTime, 500)

    time = $wallet.locker.idleTimer.getRemainingTime()

    const minutes = Math.trunc(time / (60 * 1000))
      .toString()
      .padStart(2, '0')
    const seconds = Math.trunc((time % (60 * 1000)) / 1000)
      .toString()
      .padStart(2, '0')

    timeDisplay = `
      ${minutes}:${seconds}
      ${$wallet.locker.isLocked() ? 'Locked' : 'Unlocked'} as of ${new Date(
      Date.now(),
    )}
      ${$wallet.locker.isPristine() ? 'Pristine' : 'Not Pristine'}
      `
  }
   
  $: if ($wallet && !$wallet.locker.isLocked()) getRemainingTime()
</script>

<style>
  .timer {
    font-size: 10px;
    margin: 12px;
  }

  .timer::before {
    content: 'Current Session:';
    display: block;
    font-size: 12px;
  }
</style>

{#if timeDisplay}
  <div class="timer">
    <span>{timeDisplay}</span>
  </div>
{/if}
