<script>
export let size = "medium";
export let theClass = "lds-ring "+size;
</script>

<style>

  .small {
    width: 12px;
    height: 12px;
  }
  .small div {
    width: 10px;
    height: 10px;
  }

  .medium {
    width: 80px;
    height: 80px;
  }
  .medium div {
    width: 50px;
    height: 50px;
  }

  .lds-ring {
    display: inline;
    position: relative;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    margin: 8px;
    border: 8px solid #2ECC71;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #2ECC71 transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
<div class={theClass}>
  <div />
  <div />
  <div />
  <div />
</div>