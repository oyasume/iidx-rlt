import {
  Drawer,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpenTextage = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Drawer
      anchor={isMobile ? "bottom" : "right"}
      open={!!ticket}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: isMobile ? "100%" : 400, height: isMobile ? "60vh" : "auto" } } }}
    >
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
        {ticket && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {ticket.laneText}
              </Typography>
              <IconButton onClick={onClose} aria-label="閉じる" autoFocus>
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {atariInfo && atariInfo.length > 0 ? (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                  当たり配置候補
                </Typography>
                <List>
                  {atariInfo.map((info) => (
                    <ListItem key={info.id} disablePadding>
                      <ListItemText primary={info.songTitle} secondary={info.description} />
                      <IconButton
                        aria-label={`「${info.songTitle}」をTextageで確認`}
                        onClick={() => handleOpenTextage(info.textageUrl)}
                      >
                        <LaunchIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ) : (
              <Typography>このチケットに該当する当たり配置ルールはありません。</Typography>
            )}
          </>
        )}
      </Box>
    </Drawer>
  );
};
