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

export type AppStatuses = "LOADING" | "ERROR" | "READY";

export type AppStatus = { value: AppStatuses; reason: string };

export type AppState = {
  status: AppStatus;
  keybind: {
    value: Keybind;
    progress: { attempts: number; correctAttempts: number };
  };
  keybindCount: number;
};

// Command -> attempts, correctAttempts
export type UserProgressState = {
  [key: string]: {
    attempts: number;
    correctAttempts: number;
  };
};

/*

Keep track of each keybind and how many attempts vs correct guesses the user has made at that keybind

*/
