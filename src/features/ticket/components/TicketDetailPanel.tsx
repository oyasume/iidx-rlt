import { Box, Typography, IconButton, List, ListItem, ListItemText, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LaunchIcon from "@mui/icons-material/Launch";
import { Ticket } from "../../../types";

export interface AtariInfoForPanel {
  id: string;
  songTitle: string;
  description: string;
  textageUrl: string;
}

interface TicketDetailPanelProps {
  ticket: Ticket | null;
  atariInfo: AtariInfoForPanel[];
  onClose: () => void;
}

export const TicketDetailPanel = ({ ticket, atariInfo, onClose }: TicketDetailPanelProps) => {
  const handleOpenTextage = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!ticket) return null;

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
      {
        <>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <Box component="span">{ticket.laneText}</Box>
              <Box component="span" sx={{ color: "text.secondary", ml: 1, fontSize: "0.875rem" }}>
                の当たり配置候補
              </Box>
            </Typography>
            <IconButton onClick={onClose} aria-label="閉じる">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 1 }} />
          {atariInfo && atariInfo.length > 0 ? (
            <List>
              {atariInfo.map((info) => (
                <ListItem key={info.id} disablePadding>
                  <ListItemText primary={info.songTitle} secondary={info.description} />
                  <IconButton
                    aria-label={`${info.songTitle}をTextageで確認`}
                    onClick={() => handleOpenTextage(info.textageUrl)}
                  >
                    <LaunchIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>このチケットに該当する当たり配置ルールはありません。</Typography>
          )}
        </>
      }
    </Box>
  );
};
