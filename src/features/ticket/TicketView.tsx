import React, { useState } from "react";
import { Typography, Stack, Divider, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

import { TextageForm } from "./components/TextageForm";
import { TicketSearchForm } from "./components/TicketSearchForm";
import { TicketList } from "./components/TicketList";
import { TicketControlPanel } from "./components/TicketControlPanel";
import { useTextageOpener } from "./hooks/useTextageOpener";

import { AppSettings, PlaySide, SongInfo, Ticket } from "../../types";

interface TicketViewProps {
  allTickets: Ticket[];
  filteredTickets: Ticket[];
  songs: SongInfo[];
  settings: AppSettings;
  onPlaySideChange: (newPlaySide: PlaySide) => void;
}

export const TicketView: React.FC<TicketViewProps> = ({
  allTickets,
  filteredTickets,
  songs,
  settings,
  onPlaySideChange,
}) => {
  const [selectedSong, setSelectedSong] = useState<SongInfo | null>(null);
  const { handleOpenTextage } = useTextageOpener(selectedSong, settings.playSide);

  return (
    <Stack spacing={2} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <TicketControlPanel playSide={settings.playSide} onPlaySideChange={onPlaySideChange} />
      <TicketSearchForm />
      <Divider />
      <TextageForm songs={songs} selectedSong={selectedSong} setSelectedSong={setSelectedSong} />
      <Divider />
      {allTickets.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6">チケットがありません</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            先にチケットをインポートするか、<Link to="/sample">サンプルページ</Link>でお試しください。
          </Typography>
          <Button component={Link} to="/import" variant="contained" sx={{ mt: 2 }}>
            インポートページへ
          </Button>
        </Box>
      ) : filteredTickets.length === 0 ? (
        <Typography sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}>
          検索条件に一致するチケットはありません。
        </Typography>
      ) : (
        <TicketList tickets={filteredTickets} selectedSong={selectedSong} onOpenTextage={handleOpenTextage} />
      )}
    </Stack>
  );
};
