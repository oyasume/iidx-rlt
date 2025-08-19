import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import LaunchIcon from "@mui/icons-material/Launch";
import { Box, IconButton, TableCell, TableRow, Tooltip, Typography } from "@mui/material";

import { SongInfo, Ticket } from "../../../types";
import { HighlightColor } from "../../../utils/atari";

const colorMap: Record<NonNullable<HighlightColor>, string> = {
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
};

export const TicketRow: React.FC<{
  ticket: Ticket & { highlightColor?: HighlightColor };
  selectedSong: SongInfo | null;
  onOpenTextage: (_laneText: string) => void;
  onRowClick: (ticket: Ticket) => void;
}> = ({ ticket, selectedSong, onOpenTextage, onRowClick }) => {
  return (
    <TableRow
      key={ticket.laneText}
      onClick={() => onRowClick(ticket)}
      sx={{ "&:hover": { cursor: "pointer", backgroundColor: "action.hover" } }}
    >
      <TableCell component="th" scope="row">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {ticket.highlightColor && (
              <FiberManualRecordIcon sx={{ color: colorMap[ticket.highlightColor], fontSize: "1rem" }} />
            )}
          </Box>
          <Typography variant="body1" component="span" sx={{ mr: 1 }}>
            {ticket.laneText}
          </Typography>
          <Tooltip title="Textageで確認" placement="right" disableHoverListener={!selectedSong}>
            <span>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTextage(ticket.laneText);
                }}
                disabled={!selectedSong}
                sx={{ visibility: selectedSong ? "visible" : "hidden" }}
                aria-label="Textageで確認"
                color={selectedSong ? "primary" : "inherit"}
              >
                <LaunchIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {ticket.expiration ?? ""}
        </Typography>
      </TableCell>
    </TableRow>
  );
};
