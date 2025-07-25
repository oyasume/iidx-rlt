import { TableRow, TableCell, Box, Typography, Tooltip, IconButton } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import { Ticket, SongInfo } from "../../../types";

export const TicketRow: React.FC<{
  ticket: Ticket;
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
          {ticket.expiration}
        </Typography>
      </TableCell>
    </TableRow>
  );
};
