import { Drawer, Paper, Box, Divider, useTheme, useMediaQuery } from "@mui/material";
import React from "react";

interface FloatingPanelProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
}

export const FloatingPanel: React.FC<FloatingPanelProps> = ({ open, onClose, title, children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!open) {
    return null;
  }

  const panelContent = (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
      {title && (
        <>
          {title}
          <Divider sx={{ mb: 1 }} />
        </>
      )}
      {children}
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              height: "auto",
              maxHeight: "80vh",
              overflowY: "auto",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            },
          },
        }}
      >
        {panelContent}
      </Drawer>
    );
  }

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 1300,
        width: 400,
        borderRadius: 3,
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
      }}
    >
      {panelContent}
    </Paper>
  );
};
