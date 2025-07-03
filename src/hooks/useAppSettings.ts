import { useState, useEffect, useCallback, useRef } from "react";
import { AppSettings, PlaySide } from "../types";

const DEFAULT_SETTINGS: AppSettings = {
  playSide: "1P",
};

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const debounceTimer = useRef<number | null>(null);

  useEffect(() => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (savedSettings: AppSettings) => {
      setSettings(savedSettings);
      setIsLoading(false);
    });
  }, []);

  // デバウンスして保存する
  const saveSettings = useCallback((newSettings: AppSettings) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = window.setTimeout(() => {
      chrome.storage.sync.set(newSettings, () => {
        console.log("Settings saved:", newSettings);
      });
    }, 500);
  }, []);

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
