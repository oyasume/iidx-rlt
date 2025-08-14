import React from "react";
import { Box, Divider } from "@mui/material";

interface PanelProps {
  title?: React.ReactNode;
  children: React.ReactNode;
}

export const Panel: React.FC<PanelProps> = ({ title, children }) => {
  return (
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
};
