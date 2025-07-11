import React from "react";
import { Box, Stack, Typography, Button } from "@mui/material";
import { Ticket, SongInfo } from "../../../types";

interface TicketListProps {
  tickets: Ticket[];
  selectedSong: SongInfo | null;
  onOpenTextage: (_laneText: string) => void;
}

const TicketListComponent: React.FC<TicketListProps> = ({ tickets, selectedSong, onOpenTextage }) => {
  if (tickets.length === 0) {
    return null;
  }

  return (
    <Stack>
      {tickets.map((t, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
          <Typography sx={{ width: "8rem" }}>{t.laneText}</Typography>
          <Button variant="outlined" onClick={() => onOpenTextage(t.laneText)} disabled={!selectedSong}>
            Textageで確認
          </Button>
        </Box>
      ))}
    </Stack>
  );
};

export const TicketList = React.memo(TicketListComponent);
