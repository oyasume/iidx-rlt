import React, { useCallback, useState } from "react";
import { FormProvider } from "react-hook-form";

import { TicketView } from "../ticket/TicketView";
import { sampleSongs, sampleTickets } from "../../data";
import { SongInfo } from "../../types";
import { useTicketSearch } from "../../hooks/useTicketSearch";
import { useAppSettings } from "../../contexts/AppSettingsContext";
import { makeTextageUrl } from "../../utils/makeTextageUrl";

export const SampleTicketView: React.FC = () => {
  const settings = useAppSettings();
  const { methods, filteredTickets } = useTicketSearch(sampleTickets, settings.playSide);
  const [selectedSong, setSelectedSong] = useState<SongInfo | null>(null);
  const handleOpenTextage = useCallback(
    (laneText: string) => {
      if (selectedSong) {
        const url = makeTextageUrl(selectedSong, settings.playSide, laneText);
        window.open(url, "_blank", "noopener,noreferrer");
      }
    },
    [selectedSong, settings.playSide]
  );

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
