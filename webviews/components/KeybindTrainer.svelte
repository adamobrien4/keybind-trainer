<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  // No type declaration for pressed.js library, must be imported this way
  // @ts-ignore
  import * as pressed from "pressed";
  import type { Keybind, KeycodeToKey } from "../../src/types";
  import { xor } from "lodash";
  import JSConfetti from "js-confetti";

  const jsConfetti = new JSConfetti();

  export const keycodeToKey: KeycodeToKey = {
    8: "backspace",
    9: "tab",
    13: "enter",
    16: "shift",
    17: "ctrl",
    18: "alt",
    27: "escape",
    32: "space",
    33: "pageup",
    34: "pagedown",
    35: "end",
    36: "home",
    37: "arrowleft",
    38: "arrowup",
    39: "arrowright",
    40: "arrowdown",
    45: "insert",
    46: "delete",
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    65: "a",
    66: "b",
    67: "c",
    68: "d",
    69: "e",
    70: "f",
    71: "g",
    72: "h",
    73: "i",
    74: "j",
    75: "k",
    76: "l",
    77: "m",
    78: "n",
    79: "o",
    80: "p",
    81: "q",
    82: "r",
    83: "s",
    84: "t",
    85: "u",
    86: "v",
    87: "w",
    88: "x",
    89: "y",
    90: "z",
    91: "windows",
    93: "Right Click",
    96: "numpad0",
    97: "numpad1",
    98: "numpad2",
    99: "numpad3",
    100: "numpad4",
    101: "numpad5",
    102: "numpad6",
    103: "numpad7",
    104: "numpad8",
    105: "numpad9",
    106: "numpad*",
    107: "numpadadd",
    109: "numpadsubtract",
    110: "numpadmultiply",
    111: "numpaddivide",
    112: "f1",
    113: "f2",
    114: "f3",
    115: "f4",
    116: "f5",
    117: "f6",
    118: "f7",
    119: "f8",
    120: "f9",
    121: "f10",
    122: "f11",
    123: "f12",
    182: "My Computer",
    183: "My Calculator",
    186: "semicolon",
    187: "equal",
    188: "comma",
    189: "minus",
    190: "dot",
    191: "slash",
    192: "tilde",
    219: "openSquareBracket",
    220: "backSlash",
    221: "closingSquareBracket",
    222: "backquote",
  };

  let keybinds: Keybind[] = [];
  let pressedKeys: number[] = [];
  let keybindIndex = Math.random() * keybinds.length;
  let showConfetti = true;

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
    pressedKeys = pressed.listAllKeyCodes();

    console.log(pressedKeys.length, keybinds[keybindIndex].keys.length);
    if (pressedKeys.length === keybinds[keybindIndex].keys.length) {
      // Check if arrays are equal
      let doesKeybindMatch =
        xor(pressedKeys, keybinds[keybindIndex].keys).length === 0;
      console.log(pressedKeys, "==", keybinds[keybindIndex].keys);
      console.log("XOR", doesKeybindMatch);

      if (doesKeybindMatch && showConfetti) {
        showConfetti = false;
        jsConfetti.addConfetti();
        setTimeout(() => {
          showConfetti = true;
          pickNewKeybind();
        }, 1500);
      }
    }
  }

  function pickNewKeybind() {
    console.log("New bind: ", keybinds.length);
    keybindIndex = Math.round(Math.random() * keybinds.length);
    console.log(keybindIndex);
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

<div id="container">
  <h1>Adam's Keybind Trainer</h1>

  <span>Loaded {keybinds.length} keybindings</span>

  <br />

  {#if keybinds.length > 0}
    <div class="keybind-container">
      <h3 class="keybind-title">{keybinds[keybindIndex].command}</h3>
      <div class="key-container">
        {#each keybinds[keybindIndex].keys as key}
          <div class="key-card unknown-key">
            <div class="key-card-inner">
              <span>?</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <div class="keybind-container">
    <h3 class="active-title">Active Keys</h3>
    <div class="key-container">
      {#if pressedKeys.length == 0}
        <div class="key-card-placeholder"><span>None</span></div>
      {/if}
      {#each pressedKeys as key}
        <div class="key-card">
          <div class="key-card-inner">
            <span>{keycodeToKey[key].toUpperCase()}</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  body {
    margin: 0;
    padding: 0;
  }

  #container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .keybind-title {
    font-size: 20px;
    padding: 10px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }

  .active-title {
    font-size: 20px;
    padding: 10px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }

  .keybind-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .key-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: dashed 2px black;
    width: 80vw;
    padding: 20px 0;
    border-radius: 10px;
  }

  .key-card {
    display: flex;
    width: 100px;
    height: 100px;
    margin: 2px;
    justify-content: center;
    border-radius: 5px;
    background-color: #454545;
  }

  .key-card-placeholder {
    display: flex;
    width: 100px;
    height: 100px;
    margin: 2px;
    justify-content: center;
    align-content: center;
    border-radius: 5px;
    border: solid 1px #454545;
  }

  .key-card-inner {
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

  .key-card-inner > span {
    color: #454545;
    font-size: 24px;
  }

  .unknown-key > .key-card-inner {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAPUlEQVQoU43PQQoAMAgDweT/j7ZYUGoRo+dhicTujAtnAKjgRR6bYCIFy6quWEqh1casvrAt/cURxTMSOTyKNQgKOBqKWwAAAABJRU5ErkJggg==");
    background-repeat: repeat;
  }

  .unknown-key > .key-card-inner > span {
    background-color: white;
    border-radius: 5px;
    padding: 5px 12px;
    border: solid 1px #454545;
  }
</style>
