import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { Ticket } from "types";
import { TicketSearchForm } from "./component/TicketSearchForm";

interface ToolProps {
  tickets: Ticket[];
}

const Tool: React.FC<ToolProps> = ({ tickets }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, value: number) => {
    setTabIndex(value);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        p: 2,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="チケット一覧" />
          <Tab label="当たり配置管理" />
        </Tabs>
      </Box>
      {tabIndex === 0 && (
        <Box>
          <TicketSearchForm />
          <ul>
            {tickets.map((t, index) => (
              <li key={index}>{t.laneText}</li>
            ))}
          </ul>
        </Box>
      )}
      {tabIndex === 1 && <Box>当たり配置管理画面</Box>}
    </Box>
  );
};

export default Tool;
