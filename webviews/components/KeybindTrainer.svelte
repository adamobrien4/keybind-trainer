<script lang="ts">
  type Keybind = {
    command: string;
    key: string;
  };
  import { onDestroy, onMount } from "svelte";
  let keybinds: Keybind[] = [];

  function onWindowMessage(event: any) {
    console.log("Message Recieved: ", { event });
    const message = event.data;
    switch (message.type) {
      case "onResponseKeybindings":
        console.log(message.value);
        keybinds = message.value as Keybind[];
        break;
    }
  }

  onMount(async () => {
    window.addEventListener("message", onWindowMessage);

    tsvscode.postMessage({ type: "onRequestKeybindings", value: null });
  });
  onDestroy(() => {
    window.removeEventListener("message", onWindowMessage);
  });
</script>

<h1>Keybind Trainer</h1>
<span>by Adam O'Brien</span>

<ul>
  {#each keybinds as keybind}
    <li>{keybind.command}</li>
  {/each}
</ul>
