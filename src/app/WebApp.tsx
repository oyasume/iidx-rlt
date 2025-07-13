import { useMemo } from "react";
import { Route, Routes } from "react-router-dom";
import { LocalStorage } from "../storage/localStorage";
import { useAppSettings as useLocalStorageAppSettings } from "../hooks/useAppSettings";
import { AppSettingsContext, AppSettingsDispatchContext } from "../contexts/AppSettingsContext";
import { Layout } from "../components/layout/Layout";
import { TicketViewPage } from "../pages/TicketViewPage";
import { TicketImporterPage } from "../pages/TicketImporterPage";
import { AtariManagementPage } from "../pages/AtariManagementPage";
import { SampleTicketViewPage } from "../pages/SampleTicketViewPage";

const storage = new LocalStorage();

export const WebApp: React.FC = () => {
  const { settings, updatePlaySide, isLoading } = useLocalStorageAppSettings(storage);
  const dispatchValue = useMemo(() => ({ updatePlaySide }), [updatePlaySide]);

  if (isLoading) {
    return <div>設定を読み込んでいます...</div>;
  }

  return (
    <AppSettingsContext.Provider value={settings}>
      <AppSettingsDispatchContext.Provider value={dispatchValue}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<TicketViewPage />} />
            <Route path="import" element={<TicketImporterPage />} />
            <Route path="manage" element={<AtariManagementPage />} />
            <Route path="sample" element={<SampleTicketViewPage />} />
            <Route path="tickets" element={<TicketViewPage />} />
          </Route>
        </Routes>
      </AppSettingsDispatchContext.Provider>
    </AppSettingsContext.Provider>
  );
};
