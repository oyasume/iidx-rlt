import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { TicketView } from "../component/TicketView";
import { LocalStorage } from "../storage/localStorage";
import { TicketImporter } from "../component/TicketImporter";
import { usePersistentTickets } from "../hooks/usePersistentTickets";

const storage = new LocalStorage();

export const WebApp: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { tickets, saveTickets, isLoading } = usePersistentTickets(storage);

  const handleTabChange = (_event: React.SyntheticEvent, value: number) => {
    setTabIndex(value);
  };

  if (isLoading) {
    return <Box sx={{ mt: 2 }}>データを読み込んでいます...</Box>;
  }

  return (
    <Box sx={{ bgcolor: "background.paper", color: "text.primary", p: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="インポート" />
          <Tab label="チケット一覧" />
          <Tab label="当たり配置管理" />
        </Tabs>
      </Box>
      {tabIndex === 0 && <TicketImporter onImport={saveTickets} />}
      {tabIndex === 1 && <TicketView tickets={tickets} storage={storage} songsJsonUrl={"data/songs.json"} />}
      {tabIndex === 2 && <Box sx={{ mt: 2 }}>当たり配置管理画面</Box>}
    </Box>
  );
};
