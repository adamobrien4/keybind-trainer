// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { readFileSync } from "fs";
import { KeybindTrainerPanel } from "./KeybindTrainerPanel";
import { keybindsFilePathKey } from "./constants";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("keybind-trainer.showWebview", () => {
      if (
        vscode.workspace
          .getConfiguration("keybind-trainer")
          .get(keybindsFilePathKey) !== undefined
      ) {
        KeybindTrainerPanel.createOrShow(context.extensionUri);
      } else {
        vscode.window.showErrorMessage(
          `Setting "Keybind Trainer->${keybindsFilePathKey}" is not set!`
        );
      }
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
    vscode.commands.registerCommand("keybind-trainer.set-state", () => {
      // NOTE: The value must be JSON-stringify-able
      context.globalState.update("keybindingsFilePath", "C:/home/file.json");
      console.log("State has been set");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("keybind-trainer.get-state", () => {
      console.log(context.globalState.keys);
      console.log(
        "State has been read ",
        context.globalState.get("keybindingsFilePath")
      );
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
