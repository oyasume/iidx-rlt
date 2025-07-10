import React from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";

interface TabInfo {
  label: string;
  icon: React.ReactNode;
}

interface AppBottomNavigationProps {
  tabs: TabInfo[];
  tabIndex: number;
  setTabIndex: (index: number) => void;
}

export const AppBottomNavigation: React.FC<AppBottomNavigationProps> = ({ tabs, tabIndex, setTabIndex }) => {
  const handleChange = (_e: React.SyntheticEvent, newValue: number) => setTabIndex(newValue);

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
      }}
      elevation={3}
    >
      <BottomNavigation showLabels value={tabIndex} onChange={handleChange}>
        {tabs.map((tab, i) => (
          <BottomNavigationAction key={i} label={tab.label} icon={tab.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  );
};
