import React, { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";

import { TicketView } from "../component/TicketView";
import { TicketImporter } from "../component/TicketImporter";
import { AppBottomNavigation } from "../component/AppBottomNavigation";
import { AppDrawer } from "../component/AppDrawer";
import { usePersistentTickets } from "../hooks/usePersistentTickets";
import { LocalStorage } from "../storage/localStorage";

const storage = new LocalStorage();

export const WebApp: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { tickets, saveTickets, isLoading } = usePersistentTickets(storage);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const tabs = [
    { label: "インポート", icon: <VerticalAlignBottomIcon /> },
    { label: "チケット一覧", icon: <ListAltIcon /> },
    { label: "当たり配置管理", icon: <ManageSearchIcon /> },
  ];

  const renderContent = () => {
    switch (tabIndex) {
      case 0:
        return <TicketImporter onImport={saveTickets} />;
      case 1:
        return (
          <TicketView tickets={tickets} storage={storage} songsJsonUrl={`${import.meta.env.BASE_URL}data/songs.json`} />
        );
      case 2:
        return <Box sx={{ mt: 2 }}>当たり配置管理画面</Box>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <Box sx={{ p: 2 }}>データを読み込んでいます...</Box>;
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", pb: isMobile ? 7 : 0 }}>
      {!isMobile && <AppDrawer tabs={tabs} tabIndex={tabIndex} setTabIndex={setTabIndex} />}
      <Box sx={{ flexGrow: 1 }}>{renderContent()}</Box>
      {isMobile && <AppBottomNavigation tabs={tabs} tabIndex={tabIndex} setTabIndex={setTabIndex} />}
    </Box>
  );
};
