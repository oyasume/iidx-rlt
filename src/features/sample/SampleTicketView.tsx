import React, { useState } from "react";
import { FormProvider } from "react-hook-form";

import { TicketView } from "../ticket/TicketView";
import { sampleSongs, sampleTickets } from "../../data";
import { SongInfo } from "../../types";
import { useTicketSearch } from "../../hooks/useTicketSearch";
import { useTextageOpener } from "../../hooks/useTextageOpener";
import { useAppSettings } from "../../contexts/AppSettingsContext";

export const SampleTicketView: React.FC = () => {
  const settings = useAppSettings();
  const { methods, filteredTickets } = useTicketSearch(sampleTickets, settings.playSide);
  const [selectedSong, setSelectedSong] = useState<SongInfo | null>(null);
  const { handleOpenTextage } = useTextageOpener(selectedSong, settings.playSide);

  return (
    <FormProvider {...methods}>
      <TicketView
        allTickets={sampleTickets}
        filteredTickets={filteredTickets}
        songs={sampleSongs}
        selectedSong={selectedSong}
        onSongSelect={setSelectedSong}
        onOpenTextage={handleOpenTextage}
      />
    </FormProvider>
  );
};
