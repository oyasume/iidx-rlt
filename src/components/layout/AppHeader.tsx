import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Link, Button, Collapse, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const APP_TITLE = "RLT Manager";
const SURVEY_URL = "https://forms.gle/8PTuYZgbyFJwpEgu9";
const SURVEY_NOTIFICATION_KEY = "surveyNotificationDismissed";

export const AppHeader: React.FC = () => {
  const [surveyAlertOpen, setSurveyAlertOpen] = useState(false);

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

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          color: "#000",
          backdropFilter: "blur(6px)",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {APP_TITLE}
          </Typography>
          <Button component={Link} href={SURVEY_URL} target="_blank" rel="noopener noreferrer" color="inherit">
            ご意見・改善案アンケート
          </Button>
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
                  onClick={handleCloseSurveyAlert}
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
    </>
  );
};
