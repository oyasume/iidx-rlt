import { PaletteMode } from "@mui/material";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { PlaySide } from "../types";

type SettingsState = {
  playSide: PlaySide;
  themeMode: PaletteMode;
  updatePlaySide: (side: PlaySide) => void;
  toggleThemeMode: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      playSide: "1P",
      themeMode: "light",
      updatePlaySide: (side) => set({ playSide: side }),
      toggleThemeMode: () =>
        set((state) => ({
          themeMode: state.themeMode === "light" ? "dark" : "light",
        })),
    }),
    {
      name: "settings",
    }
  )
);
