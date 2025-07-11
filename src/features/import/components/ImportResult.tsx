import React from "react";
import { Collapse, Alert, Typography } from "@mui/material";
import { ImporterState } from "../hooks/useImporter";

interface ImportResultProps {
  state: ImporterState;
}

export const ImportResult: React.FC<ImportResultProps> = ({ state }) => {
  const { status, error, importedCount } = state;
  const isVisible = status === "success" || status === "error";
  const severity = status === "error" ? "error" : "success";
  const message = status === "error" ? error : `${importedCount}件のチケットをインポートしました。`;

  if (!isVisible) return null;

  return (
    <Collapse in={isVisible}>
      <Alert severity={severity} sx={{ mt: 2 }}>
        <Typography variant="body2">{message}</Typography>
      </Alert>
    </Collapse>
  );
};
