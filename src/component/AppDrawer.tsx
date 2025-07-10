import React from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

interface TabInfo {
  label: string;
  icon: React.ReactNode;
}

interface AppDrawerProps {
  tabs: TabInfo[];
  tabIndex: number;
  setTabIndex: (index: number) => void;
  width?: number;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({ tabs, tabIndex, setTabIndex, width = 200 }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width,
          boxSizing: "border-box",
        },
      }}
    >
      <List>
        {tabs.map((tab, i) => (
          <ListItemButton key={i} selected={tabIndex === i} onClick={() => setTabIndex(i)}>
            <ListItemIcon>{tab.icon}</ListItemIcon>
            <ListItemText primary={tab.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};
