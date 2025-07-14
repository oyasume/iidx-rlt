import React, { createContext, useState, useContext, useCallback, ReactNode } from "react";

type SnackbarSeverity = "success" | "error" | "info" | "warning";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
  showSnackbar: (message: string, severity?: SnackbarSeverity) => void;
  closeSnackbar: () => void;
}

export const SnackbarContext = createContext<SnackbarState>({
  open: false,
  message: "",
  severity: "success",
  showSnackbar: () => {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  },
  closeSnackbar: () => {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  },
});

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<SnackbarSeverity>("success");

  const showSnackbar = useCallback((newMessage: string, newSeverity: SnackbarSeverity = "success") => {
    setMessage(newMessage);
    setSeverity(newSeverity);
    setOpen(true);
  }, []);

  const closeSnackbar = useCallback(() => {
    setOpen(false);
  }, []);

  const value = { open, message, severity, showSnackbar, closeSnackbar };

  return <SnackbarContext.Provider value={value}>{children}</SnackbarContext.Provider>;
};
