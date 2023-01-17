import { existsSync, readFileSync } from "fs";
import * as vscode from "vscode";
import { keybindsFilePathKey } from "./constants";
import { getNonce } from "./getNonce";
import { KeyToKeycode } from "./types";

export class KeybindTrainerPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: KeybindTrainerPanel | undefined;

  public static readonly viewType = "swiper";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  private _keyToKeycode: KeyToKeycode = {
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    ctrl: 17,
    alt: 18,
    escape: 27,
    space: 32,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    left: 37,
    arrowleft: 37,
    up: 38,
    arrowup: 38,
    right: 39,
    arrowright: 39,
    down: 40,
    arrowdown: 40,
    insert: 45,
    delete: 46,
    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57,
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,
    windows: 91,
    "Right Click": 93,
    numpad0: 96,
    numpad1: 97,
    numpad2: 98,
    numpad3: 99,
    numpad4: 100,
    numpad5: 101,
    numpad6: 102,
    numpad7: 103,
    numpad8: 104,
    numpad9: 105,
    "numpad*": 106,
    numpadadd: 107,
    numpadsubtract: 109,
    numpadmultiply: 110,
    numpaddivide: 111,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,
    "My Computer": 182,
    "My Calculator": 183,
    ";": 186,
    semicolon: 186,
    equal: 187,
    comma: 188,
    minus: 189,
    ".": 190,
    dot: 190,
    "/": 191,
    slash: 191, // aka. forwardslash
    tilde: 192,
    openSquareBracket: 219,
    backSlash: 220,
    closingSquareBracket: 221,
    backquote: 222, // aka. singlequote
  };

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (KeybindTrainerPanel.currentPanel) {
      KeybindTrainerPanel.currentPanel._panel.reveal(column);
      KeybindTrainerPanel.currentPanel._update();
      return;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      KeybindTrainerPanel.viewType,
      "Keybind Trainer",
      column || vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, "media"),
          vscode.Uri.joinPath(extensionUri, "out/compiled"),
        ],
      }
    );

    KeybindTrainerPanel.currentPanel = new KeybindTrainerPanel(
      panel,
      extensionUri
    );
  }

  public static kill() {
    KeybindTrainerPanel.currentPanel?.dispose();
    KeybindTrainerPanel.currentPanel = undefined;
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    KeybindTrainerPanel.currentPanel = new KeybindTrainerPanel(
      panel,
      extensionUri
    );
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    // Set the webview's initial html content
    this._update();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // // Handle messages from the webview
    // this._panel.webview.onDidReceiveMessage(
    //   (message) => {
    //     switch (message.command) {
    //       case "alert":
    //         vscode.window.showErrorMessage(message.text);
    //         return;
    //     }
    //   },
    //   null,
    //   this._disposables
    // );
  }

  public dispose() {
    KeybindTrainerPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private async _update() {
    const webview = this._panel.webview;

    this._panel.webview.html = this._getHtmlForWebview(webview);
    webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "onRequestKeybindings": {
          vscode.window.showInformationMessage(
            "Request for Keybindings has been made"
          );

          // TODO: Move into service
          console.log("Reading keybinds");
          const fileDirectory = vscode.workspace
            .getConfiguration("keybind-trainer")
            .get<string>(keybindsFilePathKey);

          if (fileDirectory === undefined || !existsSync(fileDirectory)) {
            vscode.window.showErrorMessage(
              `'keybind-trainer.${keybindsFilePathKey}' is invalid or does not exist on file`
            );
            return;
          }

          var obj = JSON.parse(readFileSync(fileDirectory, "utf8")) as {
            command: string;
            key: string;
          }[];
          console.log(obj);

          let parsedAndFormatted: { command: string; keys: number[] }[] = [];

          // Parse keys into better format
          for (let keybind of obj) {
            let keyStr = keybind.key;

            // Check that the keybind has keys set
            if (keyStr !== "") {
              let keys = keybind.key
                .split("+")
                .map(
                  (key: string) =>
                    this._keyToKeycode[key.toLowerCase().replace(/\[|\]/g, "")]
                );
              parsedAndFormatted.push({ command: keybind.command, keys: keys });
            }
          }

          // Send response to webview
          webview.postMessage({
            type: "onResponseKeybindings",
            value: parsedAndFormatted,
          });
        }
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // // And the uri we use to load this script in the webview
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "out",
        "compiled/KeybindTrainer.js"
      )
    );

    // Uri to load styles into webview
    const stylesResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const stylesMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "out",
        "compiled/KeybindTrainer.css"
      )
    );

    // Use a nonce to only allow specific scripts to be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${stylesResetUri}" rel="stylesheet">
				<link href="${stylesMainUri}" rel="stylesheet">
        <link href="${cssUri}" rel="stylesheet">
        <script nonce=${nonce}>
          const tsvscode = acquireVsCodeApi();
        </script>
			</head>
      <body>
			</body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</html>`;
  }
}
