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
