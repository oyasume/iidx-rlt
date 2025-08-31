import { createTheme, PaletteMode } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    highlight: {
      gold: string;
      silver: string;
      bronze: string;
    };
  }

  interface PaletteOptions {
    highlight?: {
      gold?: string;
      silver?: string;
      bronze?: string;
    };
  }
}

const lightPalette = {
  highlight: {
    gold: "#FFD700",
    silver: "#C0C0C0",
    bronze: "#CD7F32",
  },
};

const darkPalette = {
  highlight: {
    gold: "#FFD700",
    silver: "#C0C0C0",
    bronze: "#CD7F32",
  },
};

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light" ? lightPalette : darkPalette),
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
