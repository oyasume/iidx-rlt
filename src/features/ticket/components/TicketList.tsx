import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Box,
  IconButton,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import { HighlightColor, SongInfo, Ticket } from "../../../types";
import { TicketRow } from "./TicketRow";

interface TicketListProps {
  tickets: (Ticket & { highlightColor?: HighlightColor })[];
  selectedSong: SongInfo | null;
  onOpenTextage: (_laneText: string) => void;
  onRowClick: (ticket: Ticket) => void;
}

const LegendItem: React.FC<{ color: NonNullable<HighlightColor>; label: string }> = ({ color, label }) => (
  <Stack direction="row" alignItems="center" spacing={1}>
    <FiberManualRecordIcon sx={{ color: `highlight.${color}`, fontSize: "1rem" }} />
    <Typography variant="body2">{label}</Typography>
  </Stack>
);

const TicketListComponent: React.FC<TicketListProps> = ({ tickets, selectedSong, onOpenTextage, onRowClick }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleLegendClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLegendClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "legend-popover" : undefined;

  if (tickets.length === 0) {
    return null;
  }

  return (
    <TableContainer>
      <Table size="small" aria-label="チケット一覧">
        <TableHead>
          <TableRow>
            <TableCell>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                チケット
                <IconButton size="small" onClick={handleLegendClick} aria-describedby={id}>
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleLegendClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <Stack spacing={1} sx={{ p: 2 }}>
                    <LegendItem color="gold" label="強いチケット" />
                    <LegendItem color="silver" label="そこそこ強いチケット" />
                    <LegendItem color="bronze" label="当たり候補があるチケット" />
                  </Stack>
                </Popover>
              </Box>
            </TableCell>
            <TableCell>有効期限</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((t, index) => (
            <TicketRow
              ticket={t}
              selectedSong={selectedSong}
              onOpenTextage={onOpenTextage}
              onRowClick={onRowClick}
              key={`${t.laneText}-${index}`}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const TicketList = React.memo(TicketListComponent);
