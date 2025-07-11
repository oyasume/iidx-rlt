import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface ClipboardSnackbarProps {
  open: boolean;
  error?: string | null;
  successMessage?: string;
  errorMessage?: string;
  autoHideDuration?: number;
}

export const ClipboardSnackbar: React.FC<ClipboardSnackbarProps> = ({
  open,
  error = null,
  successMessage = "クリップボードにコピーしました",
  errorMessage,
  autoHideDuration = 2000,
}) => {
  const message = error ? (errorMessage ?? error) : successMessage;
  const severity = error ? "error" : "success";

  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration}>
      <Alert severity={severity} variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
