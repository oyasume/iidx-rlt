import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { TicketView } from "../component/TicketView";
import { LocalStorage } from "../storage/localStorage";

const storage = new LocalStorage();

export const WebApp: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const songsJsonUrl = "data/songs.json";

  const handleTabChange = (_event: React.SyntheticEvent, value: number) => {
    setTabIndex(value);
  };

  return (
    <Box sx={{ bgcolor: "background.paper", color: "text.primary", p: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="チケット一覧" />
          <Tab label="当たり配置管理" />
        </Tabs>
      </Box>
      {tabIndex === 0 && <TicketView tickets={[]} storage={storage} songsJsonUrl={songsJsonUrl} />}
      {tabIndex === 1 && <Box sx={{ mt: 2 }}>当たり配置管理画面</Box>}
    </Box>
  );
};
