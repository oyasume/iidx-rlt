import { useState, useEffect, useCallback, useRef } from "react";
import { AppSettings, PlaySide } from "../types";
import { IStorage } from "../storage";

const DEFAULT_SETTINGS: AppSettings = {
  playSide: "1P",
};

export const useAppSettings = (storage: IStorage) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const debounceTimer = useRef<number | null>(null);

  useEffect(() => {
    void storage.get(DEFAULT_SETTINGS).then((savedSettings: AppSettings) => {
      setSettings(savedSettings);
      setIsLoading(false);
    });
  }, [storage]);

  // デバウンスして保存する
  const saveSettings = useCallback(
    (newSettings: AppSettings) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = window.setTimeout(() => {
        void storage.set(newSettings);
      }, 500);
    },
    [storage]
  );

  const updatePlaySide = useCallback(
    (newPlaySide: PlaySide) => {
      setSettings({ playSide: newPlaySide });
      saveSettings({ playSide: newPlaySide });
    },
    [saveSettings]
  );

  return {
    settings,
    updatePlaySide,
    isLoading,
  };
};
