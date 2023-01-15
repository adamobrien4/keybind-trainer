<script lang="ts">
  type Keybind = {
    command: string;
    key: string;
  };

  import { onDestroy, onMount } from "svelte";
  // No type declaration for pressed.js library, must be imported this way
  // @ts-ignore
  import * as pressed from "pressed";

  let keybinds: Keybind[] = [];
  let pressedKeys: string[] = [];

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

  function updatePressedKeys(event: any) {
    pressedKeys = pressed.listAllKeys();
  }

  onMount(async () => {
    pressed.start();
    window.addEventListener("message", onWindowMessage);
    window.addEventListener("keydown", updatePressedKeys);
    window.addEventListener("keyup", updatePressedKeys);

    tsvscode.postMessage({ type: "onRequestKeybindings", value: null });
  });
  onDestroy(() => {
    window.removeEventListener("message", onWindowMessage);
  });
</script>

<h1>Keybind Trainer</h1>
<span>by Adam O'Brien</span>

<hr />

<span>Currently Pressed keys:</span>
<div class="container">
  {#each pressedKeys as key}
    <div class="key">
      <div class="key-inner">
        <span>{key}</span>
      </div>
    </div>
  {/each}
</div>

<ul>
  {#each keybinds as keybind}
    <li>{keybind.command}</li>
  {/each}
</ul>

<style>
  .container {
    display: flex;
    flex-direction: row;
  }

  .key {
    display: flex;
    width: 100px;
    height: 100px;
    margin: 2px;
    justify-content: center;
    border-radius: 5px;
    background-color: #454545;
  }

  .key-inner {
    display: flex;
    margin-top: 5px;
    width: 90px;
    height: 85px;
    background-color: #f2f2f2;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    box-shadow: 0px 5px 0px 0px #c9c9c9;
  }

  .key-inner > span {
    color: #454545;
    font-size: 24px;
  }
</style>
