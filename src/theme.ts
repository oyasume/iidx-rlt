import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
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
