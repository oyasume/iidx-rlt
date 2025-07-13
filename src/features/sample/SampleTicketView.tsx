import React, { useState } from "react";
import { FormProvider } from "react-hook-form";
import { Typography, Box } from "@mui/material";

import { TicketView } from "../ticket/TicketView";
import { SampleStorage } from "./storage/SampleStorage";
import { sampleSongs, sampleTickets } from "../../data";
import { SongInfo } from "../../types";
import { useTicketSearch } from "../../hooks/useTicketSearch";
import { useAppSettings } from "../../hooks/useAppSettings";
import { useTextageOpener } from "../../hooks/useTextageOpener";

const sampleStorage = new SampleStorage();

export const SampleTicketView: React.FC = () => {
  const { settings, updatePlaySide, isLoading: isSettingsLoading } = useAppSettings(sampleStorage);
  const { methods, filteredTickets } = useTicketSearch(sampleTickets, settings.playSide);
  const [selectedSong, setSelectedSong] = useState<SongInfo | null>(null);
  const { handleOpenTextage } = useTextageOpener(selectedSong, settings.playSide);

  const isLoading = isSettingsLoading;
  if (isLoading) return <Typography>サンプルデータを読み込んでいます...</Typography>;

  return (
    <Box>
      <Box sx={{ mt: 2 }}>
        <FormProvider {...methods}>
          <TicketView
            allTickets={sampleTickets}
            filteredTickets={filteredTickets}
            songs={sampleSongs}
            selectedSong={selectedSong}
            onPlaySideChange={updatePlaySide}
            onSongSelect={setSelectedSong}
            onOpenTextage={handleOpenTextage}
          />
        </FormProvider>
      </Box>
    </Box>
  );
};
