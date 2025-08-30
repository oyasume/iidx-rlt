import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PlaySide } from "../types";

type SettingsState = {
  playSide: PlaySide;
  updatePlaySide: (side: PlaySide) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      playSide: "1P",
      updatePlaySide: (side) => set({ playSide: side }),
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ playSide: s.playSide }),
    }
  )
);
