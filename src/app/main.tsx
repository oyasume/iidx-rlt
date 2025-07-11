import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { theme } from "../theme";
import { ThemeProvider } from "@mui/material";
import { WebApp } from "./WebApp";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <WebApp />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
