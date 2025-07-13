import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";

import { AppHeader } from "./AppHeader";
import { AppDrawer } from "./AppDrawer";
import { AppBottomNavigation } from "./AppBottomNavigation";
import { AppNavItem } from "../../types";

const navItems: AppNavItem[] = [
  { path: "/import", label: "インポート", icon: <VerticalAlignBottomIcon /> },
  { path: "/tickets", label: "チケット一覧", icon: <ListAltIcon /> },
  { path: "/manage", label: "当たり配置管理", icon: <ManageSearchIcon /> },
];
export const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const currentPath = location.pathname === "/" ? "/tickets" : location.pathname;
  const tabIndex = navItems.findIndex((item) => item.path === currentPath);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {!isMobile && <AppDrawer navItems={navItems} tabIndex={tabIndex} />}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppHeader />
        <Box sx={{ flexGrow: 1, p: 2, pb: isMobile ? 9 : 2 }}>
          <Outlet />
        </Box>
      </Box>
      {isMobile && <AppBottomNavigation navItems={navItems} tabIndex={tabIndex} />}
    </Box>
  );
};
