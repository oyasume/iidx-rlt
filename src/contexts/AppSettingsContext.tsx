import { createContext, useContext } from "react";
import { AppSettings } from "../types";

export const AppSettingsContext = createContext<AppSettings | undefined>(undefined);

export const useAppSettingsContext = (): AppSettings => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error("AppSettingsContext.Providerが使用されていない");
  }

  return context;
};
