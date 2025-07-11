import React, { useCallback, useState } from "react";
import { Typography, Stack, Divider, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

import { TextageForm } from "./components/TextageForm";
import { PlaySide, Ticket, SongInfo } from "../../types";
import { TicketSearchForm } from "./components/TicketSearchForm";
import { TicketList } from "./components/TicketList";
import { TicketControlPanel } from "./components/TicketControlPanel";
import { FormProvider } from "react-hook-form";
import { IStorage } from "../../storage";
import { useAppSettings } from "../../hooks/useAppSettings";
import { useSongs } from "../../hooks/useSongs";
import { useTextageOpener } from "./hooks/useTextageOpener";
import { useTicketSearch } from "./hooks/useTicketSearch";

interface TicketViewProps {
  tickets: Ticket[];
  storage: IStorage;
  songsJsonUrl: string;
}

export const TicketView: React.FC<TicketViewProps> = ({ tickets, storage, songsJsonUrl }) => {
  const { settings, updatePlaySide, isLoading: isSettingsLoading } = useAppSettings(storage);
  const { songs, isLoading: isSongDataLoading } = useSongs(songsJsonUrl);
  const [selectedSong, setSelectedSong] = useState<SongInfo | null>(null);
  const { methods, filteredTickets } = useTicketSearch(tickets, settings.playSide);

  const handlePlaySideChange = useCallback(
    (newPlaySide: PlaySide) => {
      updatePlaySide(newPlaySide);
    },
    [updatePlaySide]
  );

  const { handleOpenTextage } = useTextageOpener(selectedSong, settings.playSide);

  if (isSettingsLoading || isSongDataLoading) {
    return <Typography>データを読み込んでいます...</Typography>;
  }

  return (
    <Stack spacing={2} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <TicketControlPanel playSide={settings.playSide} onPlaySideChange={handlePlaySideChange} />
      <FormProvider {...methods}>
        <TicketSearchForm />
      </FormProvider>
      <Divider />
      <TextageForm songs={songs} selectedSong={selectedSong} setSelectedSong={setSelectedSong} />
      <Divider />
      {tickets.length === 0 ? (
        <Box>
          <Typography variant="h6">チケットがありません</Typography>
          <Typography color="text.secondary">先にチケットをインポートしてください。</Typography>
          <Button component={Link} to="/import" variant="contained" sx={{ mt: 1 }}>
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
