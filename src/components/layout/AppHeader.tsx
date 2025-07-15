import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const APP_TITLE = "RLT Manager（仮）";

export const AppHeader: React.FC = () => {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        color: "#000",
        backdropFilter: "blur(6px)",
        boxShadow: "none",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {APP_TITLE}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
