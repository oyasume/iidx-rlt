import { createTheme, PaletteMode } from "@mui/material";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
    },
    components: {
      MuiToggleButton: {
        styleOverrides: {
          root: {
            padding: "4px 16px",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
    },
  });
