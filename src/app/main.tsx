import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ReactGA from "react-ga4";

import { theme } from "../theme";
import { ThemeProvider } from "@mui/material";
import { WebApp } from "./WebApp";

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (measurementId) {
  ReactGA.initialize(measurementId);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <WebApp />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
