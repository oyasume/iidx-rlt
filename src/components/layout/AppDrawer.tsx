import React from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import { RouteDefinition } from "../../types";

interface AppDrawerProps {
  tabs: RouteDefinition[];
  tabIndex: number;
  width?: number;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({ tabs, tabIndex, width = 200 }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{ width, flexShrink: 0, [`& .MuiDrawer-paper`]: { width, boxSizing: "border-box" } }}
    >
      <List>
        {tabs.map((tab, i) => (
          <ListItemButton key={i} selected={tabIndex === i} component={Link} to={tab.path}>
            <ListItemIcon>{tab.icon}</ListItemIcon>
            <ListItemText primary={tab.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};
