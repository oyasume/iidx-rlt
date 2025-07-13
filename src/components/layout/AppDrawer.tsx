import React from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import { AppNavItem } from "../../types";

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
          <ListItemButton key={i} selected={tabIndex === i} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};
