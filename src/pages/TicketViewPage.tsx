import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { usePersistentTickets } from "../hooks/usePersistentTickets";
import { useSongs } from "../hooks/useSongs";
import { useTicketSearch } from "../hooks/useTicketSearch";
import { useTextageOpener } from "../hooks/useTextageOpener";
import { TicketView } from "../features/ticket/TicketView";
import { SongInfo } from "../types";
import { LocalStorage } from "../storage/localStorage";
import { useAppSettings } from "../contexts/AppSettingsContext";

const storage = new LocalStorage();

export const TicketViewPage = () => {
  const { tickets, isLoading: isTicketsLoading } = usePersistentTickets(storage);
  const settings = useAppSettings();
  const { methods, filteredTickets } = useTicketSearch(tickets, settings.playSide);
  const { songs, isLoading: isSongDataLoading } = useSongs({
    type: "url",
    path: `${import.meta.env.BASE_URL}data/songs.json`,
  });
  const [selectedSong, setSelectedSong] = useState<SongInfo | null>(null);
  const { handleOpenTextage } = useTextageOpener(selectedSong, settings.playSide);

  const isLoading = isTicketsLoading || isSongDataLoading;

  if (isLoading) {
    return <div>データを読み込んでいます...</div>;
  }

  return (
    <FormProvider {...methods}>
      <TicketView
        allTickets={tickets}
        filteredTickets={filteredTickets}
        songs={songs}
        selectedSong={selectedSong}
        onSongSelect={setSelectedSong}
        onOpenTextage={handleOpenTextage}
      />
    </FormProvider>
  );
};
