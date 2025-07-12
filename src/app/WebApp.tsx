import { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { FormProvider } from "react-hook-form";

import { TicketView } from "../features/ticket/TicketView";
import { TicketImporter } from "../features/import/TicketImporter";
import { AppBottomNavigation } from "../components/layout/AppBottomNavigation";
import { AppDrawer } from "../components/layout/AppDrawer";
import { AppHeader } from "../components/layout/AppHeader";
import { LocalStorage } from "../storage/localStorage";
import { SongInfo, RouteDefinition } from "../types";
import { SampleTicketView } from "../features/sample/SampleTicketView";
import { usePersistentTickets } from "../hooks/usePersistentTickets";
import { useAppSettings } from "../hooks/useAppSettings";
import { useSongs } from "../hooks/useSongs";
import { useTicketSearch } from "../hooks/useTicketSearch";
import { useTextageOpener } from "../hooks/useTextageOpener";

const storage = new LocalStorage();

export const WebApp: React.FC = () => {
  const { tickets, saveTickets, isLoading: isTicketsLoading } = usePersistentTickets(storage);
  const { settings, updatePlaySide, isLoading: isSettingsLoading } = useAppSettings(storage);
  const { songs, isLoading: isSongDataLoading } = useSongs({
    type: "url",
    path: `${import.meta.env.BASE_URL}data/songs.json`,
  });
  const [selectedSong, setSelectedSong] = useState<SongInfo | null>(null);
  const { methods, filteredTickets } = useTicketSearch(tickets, settings.playSide);
  const { handleOpenTextage } = useTextageOpener(selectedSong, settings.playSide);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isLoading = isTicketsLoading || isSettingsLoading || isSongDataLoading;

  const routes: RouteDefinition[] = [
    {
      path: "/import",
      label: "インポート",
      icon: <VerticalAlignBottomIcon />,
      element: <TicketImporter onImport={saveTickets} />,
    },
    {
      path: "/tickets",
      label: "チケット一覧",
      icon: <ListAltIcon />,
      element: (
        <FormProvider {...methods}>
          <TicketView
            allTickets={tickets}
            filteredTickets={filteredTickets}
            songs={songs}
            selectedSong={selectedSong}
            onSongSelect={setSelectedSong}
            settings={settings}
            onPlaySideChange={updatePlaySide}
            onOpenTextage={handleOpenTextage}
          />
        </FormProvider>
      ),
    },
    {
      path: "/manage",
      label: "当たり配置管理",
      icon: <ManageSearchIcon />,
      element: <Box sx={{ mt: 2 }}>当たり配置を管理する予定の画面</Box>,
    },
  ];

  const location = useLocation();
  const tabIndex = routes.findIndex((route) => route.path === location.pathname);

  if (isLoading) {
    return <Box sx={{ p: 2 }}>データを読み込んでいます...</Box>;
  }

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {!isMobile && <AppDrawer tabs={routes} tabIndex={tabIndex} />}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppHeader />
        <Box sx={{ flexGrow: 1, p: 2, pb: isMobile ? 9 : 2 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/tickets" replace />} />
            <Route path="/sample" element={<SampleTicketView />} />
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Box>
      </Box>
      {isMobile && <AppBottomNavigation tabs={routes} tabIndex={tabIndex} />}
    </Box>
  );
};
