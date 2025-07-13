import { createContext, useContext } from "react";
import { AppSettings, PlaySide } from "../types";

export const AppSettingsContext = createContext<AppSettings | undefined>(undefined);
export const AppSettingsDispatchContext = createContext<
  { updatePlaySide: (newPlaySide: PlaySide) => void } | undefined
>(undefined);

export const useAppSettings = (): AppSettings => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error("AppSettingsContextを使用してない");
  }
  return context;
};

export const useAppSettingsDispatch = () => {
  const context = useContext(AppSettingsDispatchContext);
  if (context === undefined) {
    throw new Error("AppSettingsDispatchContextを使用してない");
  }
  return context;
};
