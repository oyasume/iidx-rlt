import { useEffect, useMemo } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { LocalStorage } from "../storage/localStorage";
import { useAppSettings as useLocalStorageAppSettings } from "../hooks/useAppSettings";
import { AppSettingsContext, AppSettingsDispatchContext } from "../contexts/AppSettingsContext";
import { SnackbarProvider } from "../contexts/SnackbarContext";
import { Layout } from "../components/layout/Layout";
import { AboutPage } from "../pages/AboutPage";
import { AtariManagementPage } from "../pages/AtariManagementPage";
import { TicketViewPage } from "../pages/TicketViewPage";
import { TicketImporterPage } from "../pages/TicketImporterPage";
import { SampleTicketViewPage } from "../pages/SampleTicketViewPage";

const storage = new LocalStorage();

export const WebApp: React.FC = () => {
  const { settings, updatePlaySide, isLoading } = useLocalStorageAppSettings(storage);
  const dispatchValue = useMemo(() => ({ updatePlaySide }), [updatePlaySide]);

  const navigate = useNavigate();
  useEffect(() => {
    const redirectPath = sessionStorage.getItem("redirect");
    if (redirectPath) {
      sessionStorage.removeItem("redirect");
      const basePath = import.meta.env.BASE_URL;
      const pathWithoutBase = redirectPath.startsWith(basePath)
        ? "/" + redirectPath.substring(basePath.length)
        : redirectPath;
      void navigate(pathWithoutBase.replace("//", "/"), { replace: true });
    }
  }, [navigate]);

  if (isLoading) {
    return <div>設定を読み込んでいます...</div>;
  }

  return (
    <SnackbarProvider>
      <AppSettingsContext.Provider value={settings}>
        <AppSettingsDispatchContext.Provider value={dispatchValue}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<TicketViewPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="import" element={<TicketImporterPage />} />
              <Route path="manage" element={<AtariManagementPage />} />
              <Route path="sample" element={<SampleTicketViewPage />} />
              <Route path="tickets" element={<TicketViewPage />} />
            </Route>
          </Routes>
        </AppSettingsDispatchContext.Provider>
      </AppSettingsContext.Provider>
    </SnackbarProvider>
  );
};
