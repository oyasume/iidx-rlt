import { useCallback, useMemo, useState } from "react";
import { FormProvider } from "react-hook-form";

import { usePersistentTickets } from "../hooks/usePersistentTickets";
import { useSongs } from "../hooks/useSongs";
import { useTicketSearch } from "../hooks/useTicketSearch";
import { TicketView } from "../features/ticket/TicketView";
import { SongInfo } from "../types";
import { LocalStorage } from "../storage/localStorage";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { makeTextageUrl } from "../utils/makeTextageUrl";
import { TicketDetailPanel, AtariInfoForPanel } from "../features/ticket/components/TicketDetailPanel";
import { TicketDetailProvider, useTicketDetail } from "../features/ticket/contexts/TicketDetailContext";
import { useAtariRules } from "../hooks/useAtariRules";
import { useAtariMatcher } from "../hooks/useAtariMatcher";
import { sampleTickets } from "../data";

const storage = new LocalStorage();

interface TicketViewPageProps {
  isSample?: boolean;
}

const TicketViewPageContent: React.FC<TicketViewPageProps> = ({ isSample = false }) => {
  const settings = useAppSettings();
  // チケット
  const { tickets: storageTickets, isLoading: isStorageTicketsLoading } = usePersistentTickets(storage);
  const tickets = isSample ? sampleTickets : storageTickets;
  const isTicketsLoading = isSample ? false : isStorageTicketsLoading;
  const { methods, filteredTickets } = useTicketSearch(tickets, settings.playSide);
  // 曲
  const { songs, isLoading: isSongDataLoading } = useSongs({
    type: "url",
    path: `${import.meta.env.BASE_URL}data/songs.json`,
  });
  const [selectedSong, setSelectedSong] = useState<SongInfo | null>(null);
  // 当たり定義
  const { allRules, uniquePatterns, isLoading: isAtariRulesLoading } = useAtariRules();
  const atariMatcher = useAtariMatcher(tickets, allRules, uniquePatterns, settings.playSide);
  // チケット選択
  const { detailTicket, setDetailTicket } = useTicketDetail();

  const atariInfoForPanel = useMemo((): AtariInfoForPanel[] => {
    if (!detailTicket) return [];
    const rules = atariMatcher.get(detailTicket.laneText) || [];
    // ここら辺やりづらいのどうにかしたい
    const songsInRules = songs.filter((s) => rules.some((r) => s.title === r.songTitle));
    return rules
      .map((rule) => {
        const song = songsInRules.find((s) => s.title === rule.songTitle);
        if (!song) return null;
        return {
          id: rule.id,
          songTitle: rule.songTitle,
          description: rule.description,
          textageUrl: makeTextageUrl(song, settings.playSide, detailTicket.laneText),
        };
      })
      .filter((info): info is AtariInfoForPanel => info !== null);
  }, [detailTicket, atariMatcher, songs, settings.playSide]);

  const handleOpenTextage = useCallback(
    (laneText: string) => {
      if (selectedSong) {
        const url = makeTextageUrl(selectedSong, settings.playSide, laneText);
        window.open(url, "_blank", "noopener,noreferrer");
      }
    },
    [selectedSong, settings.playSide]
  );

  const isLoading = isTicketsLoading || isSongDataLoading || isAtariRulesLoading;

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
      <TicketDetailPanel ticket={detailTicket} atariInfo={atariInfoForPanel} onClose={() => setDetailTicket(null)} />
    </FormProvider>
  );
};

export const TicketViewPage: React.FC<TicketViewPageProps> = ({ isSample }) => {
  return (
    <TicketDetailProvider>
      <TicketViewPageContent isSample={isSample} />
    </TicketDetailProvider>
  );
};
