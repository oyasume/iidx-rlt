import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router";
import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { WebApp } from "./app/WebApp";

export const render = (url: string, helmetContext: { helmet?: HelmetServerState }): string => {
  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <ThemeProvider theme={theme}>
          <StaticRouter location={url}>
            <WebApp />
          </StaticRouter>
        </ThemeProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
};
