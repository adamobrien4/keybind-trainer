export type Keybind = {
  command: string;
  keys: number[];
};

export type KeyToKeycode = {
  [key: string]: number;
};

export type KeycodeToKey = {
  [key: number]: string;
};

export type Message = {
  type: "onRequestAppState";
  value: any;
};

export type AppStates = "LOADING" | "ERROR" | "READY";

export type AppStatus = { state: AppStates; reason: string };

export type AppState = {
  status: AppStatus;
  keybind: Keybind;
  keybindCount: number;
};
