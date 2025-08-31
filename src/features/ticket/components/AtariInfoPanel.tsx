import CloseIcon from "@mui/icons-material/Close";
import LaunchIcon from "@mui/icons-material/Launch";
import { Box, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import ReactGA from "react-ga4";

import { FloatingPanel } from "../../../components/ui/FloatingPanel";
import { useSettingsStore } from "../../../store/settingsStore";
import { AtariRule, Ticket } from "../../../types";
import { makeTextageUrl } from "../../../utils/makeTextageUrl";

interface AtariInfoPanelProps {
  ticket: Ticket;
  rules: AtariRule[];
  onClose: () => void;
}

export const AtariInfoPanel = ({ ticket, rules, onClose }: AtariInfoPanelProps) => {
  const playSide = useSettingsStore((s) => s.playSide);

  const handleOpenTextage = (rule: AtariRule) => {
    ReactGA.event({
      category: "Outbound Link",
      action: "click_textage_link_from_detail",
      label: rule.title,
    });
    const url = makeTextageUrl(rule.url, playSide, ticket.laneText);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const panelTitle = (
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        <Box component="span">{ticket.laneText}</Box>
        <Box component="span" sx={{ color: "text.secondary", ml: 1, fontSize: "0.875rem" }}>
          の当たり配置候補
        </Box>
      </Typography>
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Box>
  );

  return (
    <FloatingPanel open={!!ticket} onClose={onClose} title={panelTitle}>
      <List>
        {rules.map((rule) => (
          <ListItem key={rule.id} disablePadding>
            <ListItemText primary={rule.title} secondary={rule.description} />
            <IconButton onClick={() => handleOpenTextage(rule)}>
              <LaunchIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </FloatingPanel>
  );
};
