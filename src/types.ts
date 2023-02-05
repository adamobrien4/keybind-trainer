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

export type AppState = {
  status: "LOADING" | "READY";
  keybind: Keybind;
  keybindCount: number;
};
