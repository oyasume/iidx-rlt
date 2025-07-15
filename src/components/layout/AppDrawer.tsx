import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { AppNavItem } from "../../types";
import { GitHubLink } from "../../components/links/GitHubLink";
import { XLink } from "../../components/links/XLink";

interface AppDrawerProps {
  navItems: AppNavItem[];
  tabIndex: number;
  width?: number;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({ navItems, tabIndex, width = 200 }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{ width, flexShrink: 0, [`& .MuiDrawer-paper`]: { width, boxSizing: "border-box" } }}
    >
      <List>
        {navItems.map((item, i) => (
          <ListItemButton key={i} selected={tabIndex === i} component={RouterLink} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ marginTop: "auto" }}>
        <Divider />
        <List>
          <GitHubLink variant="listitem" />
          <XLink variant="listitem" />
        </List>
      </Box>
    </Drawer>
  );
};
