// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { readFileSync } from "fs";
import { KeybindTrainerPanel } from "./KeybindTrainerPanel";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("keybind-trainer.showWebview", () => {
      KeybindTrainerPanel.createOrShow(context.extensionUri);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("keybind-trainer.refresh", () => {
      KeybindTrainerPanel.kill();
      KeybindTrainerPanel.createOrShow(context.extensionUri);
      // setTimeout(() => {
      //   vscode.commands.executeCommand(
      //     "workbench.action.webview.openDeveloperTools"
      //   );
      // }, 250);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("keybind-trainer.read-keybinds", () => {
      console.log("Reading keybinds");
      // TODO: Ask user to define this path, or retrieve from users settings
      const keybindingsFilePath =
        "C:/Users/adamp/AppData/Roaming/Code/User/keybindings.json";

      console.log(JSON.parse(readFileSync(keybindingsFilePath, "utf8")));
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
