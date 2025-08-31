import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  alpha,
  AppBar,
  Button,
  Collapse,
  IconButton,
  Link,
  Switch,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ReactGA from "react-ga4";

import { useSettingsStore } from "../../state/settingsStore";

const APP_TITLE = "RLT Manager";
const SURVEY_URL = "https://forms.gle/8PTuYZgbyFJwpEgu9";
const SURVEY_NOTIFICATION_KEY = "surveyNotificationDismissed";

const handleSurveyClick = (source: "Header" | "Alert") => {
  ReactGA.event({
    category: "UserAction",
    action: `Click Google Form (${source})`,
  });
};

export const AppHeader: React.FC = () => {
  const [surveyAlertOpen, setSurveyAlertOpen] = useState(false);
  const toggleThemeMode = useSettingsStore((s) => s.toggleThemeMode);
  const theme = useTheme();

  useEffect(() => {
    const dismissed = localStorage.getItem(SURVEY_NOTIFICATION_KEY);
    if (!dismissed) {
      setSurveyAlertOpen(true);
    }
  }, []);

  const handleCloseSurveyAlert = () => {
    localStorage.setItem(SURVEY_NOTIFICATION_KEY, "true");
    setSurveyAlertOpen(false);
  };

  const handleAlertSurveyClick = () => {
    handleSurveyClick("Alert");
    handleCloseSurveyAlert();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.8),
        color: "text.primary",
        backdropFilter: "blur(6px)",
        boxShadow: "none",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {APP_TITLE}
        </Typography>
        <Button
          component={Link}
          href={SURVEY_URL}
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          onClick={() => handleSurveyClick("Header")}
        >
          フィードバック
        </Button>
        <Switch checked={theme.palette.mode === "dark"} onChange={toggleThemeMode} />
      </Toolbar>
      <Collapse in={surveyAlertOpen}>
        <Alert
          severity="info"
          action={
            <>
              <Button
                color="inherit"
                size="small"
                href={SURVEY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleAlertSurveyClick}
              >
                回答する
              </Button>
              <IconButton aria-label="close" color="inherit" size="small" onClick={handleCloseSurveyAlert}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </>
          }
          sx={{ m: 2, mt: 0 }}
        >
          今後の開発のため、ご意見・改善案などを募集しています。
        </Alert>
      </Collapse>
    </AppBar>
  );
};
