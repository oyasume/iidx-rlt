import React, { useState } from "react";
import {
  Box,
  Typography,
  Alert,
  Collapse,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Link,
  CircularProgress,
  TextField,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Ticket } from "../types";
import { ClipboardSnackbar } from "./ClipboardSnackBar";
import { useClipboard } from "../hooks/useClipboard";

interface TicketImporterProps {
  onImport: (_tickets: Ticket[]) => Promise<void>;
}

const bookmarkletCode = `javascript:(function(){const t='${import.meta.env.VITE_BOOKMARKLET_URL}?'+new Date().getTime();const e=document.createElement('script');e.src=t;document.body.appendChild(e);})();`;

export const TicketImporter: React.FC<TicketImporterProps> = ({ onImport }) => {
  const [jsonText, setJsonText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [showBookmarklet, setShowBookmarklet] = useState(false);
  const { copyToClipboard, isCopied, error: copyError } = useClipboard();

  const handleCopyToClipboard = () => {
    void copyToClipboard(bookmarkletCode);
  };

  const handleImportClick = async () => {
    setStatus("loading");
    setError(null);

    if (!jsonText.trim()) {
      setError("インポートするチケットデータがありません。");
      setStatus("error");
      return;
    }

    try {
      const parsedData = JSON.parse(jsonText) as Ticket[];
      if (!Array.isArray(parsedData)) {
        setError("データが配列形式になっていません。");
        setStatus("error");
        return;
      }
      await onImport(parsedData);
      setStatus("success");
      setJsonText("");
    } catch (e) {
      if (e instanceof SyntaxError) {
        setError(
          "チケットデータの形式が正しくありません。公式サイトでブックマークレットを実行し、表示された内容をすべてコピーして貼り付けてください。"
        );
      } else {
        setError("チケットのインポート中に予期せぬエラーが発生しました。");
      }
      setStatus("error");
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Stepper orientation="vertical">
        <Step active>
          <StepLabel>
            <Typography variant="h6">公式サイトからチケットをコピー</Typography>
          </StepLabel>
          <StepContent>
            <Typography>IIDX公式サイトでブックマークレットを実行し、チケット情報をコピーします。</Typography>
            <Link component="button" onClick={() => setShowBookmarklet(!showBookmarklet)}>
              ブックマークレットを表示
            </Link>
            <Collapse in={showBookmarklet}>
              <Box sx={{ mt: 1, border: "1px solid", borderColor: "divider" }}>
                <Box sx={{ bgcolor: "action.hover", px: 2, py: 0.5 }}>
                  <Button size="small" startIcon={<ContentCopyIcon />} onClick={handleCopyToClipboard}>
                    コピー
                  </Button>
                </Box>
                <Box sx={{ p: 2, wordBreak: "break-all", bgcolor: "#f5f5f5" }}>{bookmarkletCode}</Box>
              </Box>
              <Accordion sx={{ mt: 1 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>補足</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary" variant="body2">
                    ※コピーしたコードをURLにしたブックマークを作成してください。
                    その後、IIDX公式サイトでブックマークをクリックすることで実行されます。
                    <br />
                    取得されるのはチケットの情報のみで、外部サーバーに送信されることはありません。
                    ソースコードはGitHubで公開されています。
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Collapse>
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
              onChange={(e) => {
                setJsonText(e.target.value);
                setStatus("idle");
              }}
              placeholder="ここにコピーしたデータを貼り付けます"
              variant="outlined"
              disabled={status === "loading"}
            />
            <Button
              variant="contained"
              onClick={() => {
                void handleImportClick();
              }}
              disabled={status === "loading"}
              size="large"
              startIcon={status === "loading" ? <CircularProgress color="inherit" size={20} /> : null}
              sx={{ mt: 2 }}
            >
              インポート実行
            </Button>
          </StepContent>
        </Step>
      </Stepper>
      <Collapse in={status === "success" || status === "error"}>
        <Alert severity={status === "error" ? "error" : "success"} sx={{ mt: 2 }}>
          {status === "error" ? error : <Typography variant="body2">チケットをインポートしました。</Typography>}
        </Alert>
      </Collapse>
      <ClipboardSnackbar open={isCopied || !!copyError} error={copyError} />
    </Box>
  );
};
