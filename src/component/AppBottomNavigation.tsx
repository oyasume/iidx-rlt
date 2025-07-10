import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { RouteDefinition } from "../types";

interface AppBottomNavigationProps {
  tabs: RouteDefinition[];
  tabIndex: number;
}

export const AppBottomNavigation: React.FC<AppBottomNavigationProps> = ({ tabs, tabIndex }) => {
  return (
    <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation showLabels value={tabIndex}>
        {tabs.map((tab) => (
          <BottomNavigationAction key={tab.path} label={tab.label} icon={tab.icon} component={Link} to={tab.path} />
        ))}
      </BottomNavigation>
    </Paper>
  );
};
