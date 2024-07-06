import { create } from "zustand";
import config from "../config";

interface EditorStore {
  language: {
    id: number;
    name: string;
  };
  defaultThemes: string[];
  isEditorReady: boolean;
  setEditorState: (arg: boolean) => void;
  setSelectedLanguage: (arg: string) => void;
  theme: string;
  setSelectedTheme: (arg: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  language: config.supportedLanguages.find((lang) => lang.name === "html")!,
  defaultThemes: ["light"],
  isEditorReady: false,
  setEditorState: (arg: boolean) => set({ isEditorReady: arg }),
  setSelectedLanguage: (arg: string) =>
    set({
      language: config.supportedLanguages.find((lang) => lang.name === arg),
    }),
  theme: "light",
  setSelectedTheme: (args: string) => set({ theme: args }),
}));
