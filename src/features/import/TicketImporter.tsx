import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";

import { Ticket } from "../../types";
import { BookmarkletSection } from "./components/BookmarkletSection";
import { useImporter } from "./hooks/useImporter";
import { ImportResult } from "./components/ImportResult";

interface TicketImporterProps {
  onImport: (_tickets: Ticket[]) => Promise<void>;
}

export const TicketImporter: React.FC<TicketImporterProps> = ({ onImport }) => {
  const [jsonText, setJsonText] = useState("");
  const { state, importTickets } = useImporter(onImport);

  useEffect(() => {
    if (state.status === "success") {
      setJsonText("");
    }
  }, [state.status]);

  const handleTextChange = (text: string) => {
    setJsonText(text);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Stepper orientation="vertical">
        <Step active>
          <StepLabel>
            <Typography variant="h6">公式サイトからチケットをコピー</Typography>
          </StepLabel>
          <StepContent>
            <BookmarkletSection />
          </StepContent>
        </Step>
        <Step active>
          <StepLabel>
            <Typography variant="h6">データを貼り付けてインポート</Typography>
          </StepLabel>
          <StepContent>
            <TextField
              multiline
              rows={6}
              fullWidth
              value={jsonText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="ここにコピーしたデータを貼り付けます"
              variant="outlined"
              disabled={state.status === "loading"}
            />
            <Button
              variant="contained"
              onClick={() => void importTickets(jsonText)}
              disabled={state.status === "loading"}
              size="large"
              startIcon={state.status === "loading" ? <CircularProgress color="inherit" size={20} /> : null}
              sx={{ mt: 2 }}
            >
              インポート実行
            </Button>
          </StepContent>
        </Step>
      </Stepper>
      <ImportResult state={state} />
    </Box>
  );
};
