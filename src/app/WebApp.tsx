import { Box, useMediaQuery, useTheme } from "@mui/material";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { TicketView } from "../features/ticket/TicketView";
import { TicketImporter } from "../features/import/TicketImporter";
import { AppBottomNavigation } from "../components/layout/AppBottomNavigation";
import { AppDrawer } from "../components/layout/AppDrawer";
import { AppHeader } from "../components/layout/AppHeader";
import { usePersistentTickets } from "../hooks/usePersistentTickets";
import { LocalStorage } from "../storage/localStorage";
import { RouteDefinition } from "../types";

const storage = new LocalStorage();

export const WebApp: React.FC = () => {
  const { tickets, saveTickets, isLoading } = usePersistentTickets(storage);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        <TicketView tickets={tickets} storage={storage} songsJsonUrl={`${import.meta.env.BASE_URL}data/songs.json`} />
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
