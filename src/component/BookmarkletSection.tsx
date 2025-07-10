import React, { useState } from "react";
import { Box, Typography, Collapse, Button, Link, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useClipboard } from "../hooks/useClipboard";
import { ClipboardSnackbar } from "./ClipboardSnackBar";

const bookmarkletCode = `javascript:(function(){const t='https://oyasume.github.io/iidx-rlt/bookmarklet.js?v='+new Date().getTime();const e=document.createElement('script');e.src=t;document.body.appendChild(e);})();`;

export const BookmarkletSection: React.FC = () => {
  const [showBookmarklet, setShowBookmarklet] = useState(false);
  const { copyToClipboard, isCopied, error: copyError } = useClipboard();

  return (
    <>
      <Typography>IIDX公式サイトでブックマークレットを実行し、チケット情報をコピーします。</Typography>
      <Link component="button" onClick={() => setShowBookmarklet(!showBookmarklet)}>
        ブックマークレットを表示
      </Link>
      <Collapse in={showBookmarklet}>
        <Box sx={{ mt: 1, border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ bgcolor: "action.hover", px: 2, py: 0.5 }}>
            <Button size="small" startIcon={<ContentCopyIcon />} onClick={() => void copyToClipboard(bookmarkletCode)}>
              コピー
            </Button>
          </Box>
          <Box sx={{ p: 2, wordBreak: "break-all", bgcolor: "#f5f5f5" }}>{bookmarkletCode}</Box>
        </Box>
        <Accordion sx={{ mt: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
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
      <ClipboardSnackbar open={isCopied || !!copyError} error={copyError} />
    </>
  );
};
