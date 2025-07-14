import React from "react";
import { Snackbar, Alert } from "@mui/material";

type AppSnackbarSeverity = "success" | "error" | "info" | "warning";

interface AppSnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity: AppSnackbarSeverity;
  autoHideDuration?: number;
}

export const AppSnackbar: React.FC<AppSnackbarProps> = ({
  open,
  onClose,
  message,
  severity,
  autoHideDuration = 5000,
}) => {
  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    onClose();
  };

  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={handleClose}>
      <Alert severity={severity} variant="filled" sx={{ width: "100%" }} onClose={handleClose}>
        {message}
      </Alert>
    </Snackbar>
  );
};
