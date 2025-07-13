import React, { useEffect, useState } from "react";
import { Box, Typography, Stepper, Step, StepLabel, StepContent } from "@mui/material";
import { usePersistentTickets } from "../hooks/usePersistentTickets";
import { useImporter } from "../features/import/hooks/useImporter";
import { BookmarkletSection } from "../features/import/components/BookmarkletSection";
import { JsonImportForm } from "../features/import/components/JsonImportForm";
import { ImportResult } from "../features/import/components/ImportResult";
import { LocalStorage } from "../storage/localStorage";

const storage = new LocalStorage();

export const TicketImporterPage: React.FC = () => {
  const { saveTickets } = usePersistentTickets(storage);
  const [jsonText, setJsonText] = useState("");
  const { state, importTickets } = useImporter(saveTickets);

  useEffect(() => {
    if (state.status === "success") {
      setJsonText("");
    }
  }, [state.status]);

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
            <JsonImportForm
              jsonText={jsonText}
              onTextChange={setJsonText}
              onImportClick={() => void importTickets(jsonText)}
              isLoading={state.status === "loading"}
            />
          </StepContent>
        </Step>
      </Stepper>
      <ImportResult state={state} />
    </Box>
  );
};
