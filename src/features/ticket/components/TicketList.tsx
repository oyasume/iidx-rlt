import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Ticket, SongInfo } from "../../../types";
import { TicketRow } from "./TicketRow";

interface TicketListProps {
  tickets: Ticket[];
  selectedSong: SongInfo | null;
  onOpenTextage: (_laneText: string) => void;
  onRowClick: (ticket: Ticket) => void;
}

const TicketListComponent: React.FC<TicketListProps> = ({ tickets, selectedSong, onOpenTextage, onRowClick }) => {
  if (tickets.length === 0) {
    return null;
  }

  return (
    <TableContainer>
      <Table size="small" aria-label="チケット一覧">
        <TableHead>
          <TableRow>
            <TableCell>チケット</TableCell>
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
