import React, { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { Box, Typography, Stepper, Step, StepLabel, StepContent } from "@mui/material";

import { usePersistentTickets } from "../hooks/usePersistentTickets";
import { useImporter } from "../features/import/hooks/useImporter";
import { BookmarkletSection } from "../features/import/components/BookmarkletSection";
import { JsonImportForm } from "../features/import/components/JsonImportForm";
import { LocalStorage } from "../storage/localStorage";
import { useSnackbar } from "../contexts/SnackbarContext";

const storage = new LocalStorage();

export const TicketImporterPage: React.FC = () => {
  const { saveTickets } = usePersistentTickets(storage);
  const [jsonText, setJsonText] = useState("");
  const { state, importTickets } = useImporter(saveTickets);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (state.status === "success") {
      setJsonText("");
      showSnackbar(`${state.importedCount}件のチケットをインポートしました。`, "success");
      ReactGA.event({
        category: "User",
        action: "import_tickets_success",
        value: state.importedCount,
      });
    } else if (state.status === "error" && state.error) {
      showSnackbar(state.error, "error");
    }
  }, [state.status, state.error, state.importedCount, showSnackbar]);

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
    </Box>
  );
};
