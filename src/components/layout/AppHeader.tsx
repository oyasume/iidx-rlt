import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

const APP_TITLE = "iidx-rlt";
const GITHUB_URL = "https://github.com/oyasume/iidx-rlt";

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

        <IconButton
          edge="end"
          color="inherit"
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="github repository"
        >
          <GitHubIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
