import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKey } from "../constant";

export enum SubmitKey {
  Enter = "Enter",
  CtrlEnter = "Ctrl + Enter",
  ShiftEnter = "Shift + Enter",
  AltEnter = "Alt + Enter",
  MetaEnter = "Meta + Enter",
}

export enum Theme {
  Auto = "auto",
  Dark = "dark",
  Light = "light",
}

export const DEFAULT_CONFIG = {
  submitKey: SubmitKey.CtrlEnter as SubmitKey,
  avatar: "1f603",
  fontSize: 13,
  theme: Theme.Auto as Theme,
  tightBorder: true,
  sendPreviewBubble: false,
  sidebarWidth: 230,

  disablePromptHint: false,

  dontShowMaskSplashScreen: false, // dont show splash screen when create chat

  modelConfig: {
    model: "gpt-3.5-turbo-16k" as ModelType,
    temperature: 0.8,
    max_tokens: 4096,
    presence_penalty: 0,
    sendMemory: false,
    historyMessageCount: 20,
    compressMessageLengthThreshold: 25000,
  },
};

export type ChatConfig = typeof DEFAULT_CONFIG;

export type ChatConfigStore = ChatConfig & {
  reset: () => void;
  update: (updater: (config: ChatConfig) => void) => void;
};

export type ModelConfig = ChatConfig["modelConfig"];

const ENABLE_GPT4 = false;

export const ALL_MODELS = [
  {
    name: "gpt-3.5-turbo",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-0301",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-0613",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-16k",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-16k-0613",
    available: true,
  },
] as const;

export type ModelType = (typeof ALL_MODELS)[number]["name"];

export function limitNumber(
  x: number,
  min: number,
  max: number,
  defaultValue: number,
) {
  if (typeof x !== "number" || isNaN(x)) {
    return defaultValue;
  }

  return Math.min(max, Math.max(min, x));
}

export function limitModel(name: string) {
  return ALL_MODELS.some((m) => m.name === name && m.available)
    ? name
    : ALL_MODELS[3].name;
}

export const ModalConfigValidator = {
  model(x: string) {
    return limitModel(x) as ModelType;
  },
  max_tokens(x: number) {
    return limitNumber(x, 0, 32000, 2000);
  },
  presence_penalty(x: number) {
    return limitNumber(x, -2, 2, 0);
  },
  temperature(x: number) {
    return limitNumber(x, 0, 1, 1);
  },
};

export const useAppConfig = create<ChatConfigStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_CONFIG,

      reset() {
        set(() => ({ ...DEFAULT_CONFIG }));
      },

      update(updater) {
        const config = { ...get() };
        updater(config);
        set(() => config);
      },
    }),
    {
      name: StoreKey.Config,
      version: 2,
      migrate(persistedState, version) {
        if (version === 2) return persistedState as any;

        const state = persistedState as ChatConfig;
        state.modelConfig.sendMemory = false;
        state.modelConfig.historyMessageCount = 20;
        state.modelConfig.compressMessageLengthThreshold = 25000;
        state.dontShowMaskSplashScreen = false;

        return state;
      },
    },
  ),
);
